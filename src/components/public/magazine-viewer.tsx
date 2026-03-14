"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  type CSSProperties,
} from "react";
import Image from "next/image";
import type { MagazinePage } from "@/types/magazine";

// ── Lazy load react-pageflip ──
function useFlipBook() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Component, setComponent] = useState<any>(null);
  useEffect(() => {
    import("react-pageflip").then((mod) => {
      setComponent(() => mod.default || mod);
    });
  }, []);
  return Component;
}

const FlipPage = forwardRef<
  HTMLDivElement,
  { page: MagazinePage; style?: CSSProperties }
>(function FlipPage({ page, style }, ref) {
  return (
    <div
      ref={ref}
      style={style}
      className="relative h-full w-full overflow-hidden bg-neutral-900"
    >
      <Image
        src={page.imageUrl}
        alt={`Page ${page.pageNumber}`}
        fill
        className="object-contain"
        sizes="(min-width: 768px) 50vw, 100vw"
        priority={page.pageNumber <= 2}
        draggable={false}
      />
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded bg-black/50 px-2 py-0.5 text-xs text-white">
        {page.pageNumber}
      </span>
    </div>
  );
});

// ── Controls ──
function Controls({
  onPrev,
  onNext,
  canPrev,
  canNext,
  label,
}: {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center justify-center gap-4 py-3">
      <button
        onClick={onPrev}
        disabled={!canPrev}
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-700 text-lg text-gray-300 transition-colors hover:bg-gray-800 disabled:opacity-30"
      >
        &larr;
      </button>
      <span className="min-w-[100px] text-center text-sm text-gray-500">
        {label}
      </span>
      <button
        onClick={onNext}
        disabled={!canNext}
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-700 text-lg text-gray-300 transition-colors hover:bg-gray-800 disabled:opacity-30"
      >
        &rarr;
      </button>
    </div>
  );
}

// ── Mobile prev flip overlay (CSS 3D) ──
// Renders on top of react-pageflip when going prev on mobile
function MobilePrevFlipOverlay({
  prevPage,
  currentPage,
  pageW,
  pageH,
  onComplete,
}: {
  prevPage: MagazinePage;
  currentPage: MagazinePage;
  pageW: number;
  pageH: number;
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const animRef = useRef<number>(0);
  const DURATION = 600;

  useEffect(() => {
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setProgress(eased);
      if (t < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        onComplete();
      }
    }
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [onComplete]);

  // Previous page flips in from the left: starts at rotateY(180deg), ends at rotateY(0)
  const angle = 180 - progress * 180;

  return (
    <div
      className="absolute inset-0 z-50"
      style={{ perspective: "1200px", width: pageW, height: pageH }}
    >
      {/* Current page visible underneath */}
      <div className="absolute inset-0 overflow-hidden bg-neutral-900">
        <Image
          src={currentPage.imageUrl}
          alt={`Page ${currentPage.pageNumber}`}
          fill
          className="object-contain"
          sizes="100vw"
          draggable={false}
        />
      </div>

      {/* Previous page flipping in from the left */}
      <div
        className="absolute inset-0 overflow-hidden bg-neutral-900"
        style={{
          transformOrigin: "right center",
          transform: `rotateY(${-angle}deg)`,
          backfaceVisibility: "hidden",
          zIndex: angle < 90 ? 2 : 0,
        }}
      >
        <Image
          src={prevPage.imageUrl}
          alt={`Page ${prevPage.pageNumber}`}
          fill
          className="object-contain"
          sizes="100vw"
          draggable={false}
        />
        <div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: (angle / 180) * 0.35 }}
        />
      </div>

      {/* Shadow on current page from lifted prev page */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to left, rgba(0,0,0,${0.25 * Math.sin((progress) * Math.PI)}) 0%, transparent 50%)`,
          zIndex: 1,
        }}
      />
    </div>
  );
}

// ── Unified viewer ──
export function MagazineViewer({
  pages,
  magazineId,
}: {
  pages: MagazinePage[];
  magazineId?: string;
}) {
  const HTMLFlipBook = useFlipBook();
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);
  const [dims, setDims] = useState<{
    pageW: number;
    pageH: number;
    wrapW: number;
    wrapH: number;
    isMobile: boolean;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPortrait, setIsPortrait] = useState(false);
  const pageRatioRef = useRef(3 / 4);

  // Mobile prev flip overlay state
  const [mobilePrevFlip, setMobilePrevFlip] = useState<{
    prevPage: MagazinePage;
    currentPage: MagazinePage;
  } | null>(null);

  // Load actual image ratio from first page, then compute dimensions
  useEffect(() => {
    let cancelled = false;

    function computeDims() {
      if (!containerRef.current) return;
      const { width: cw, height: ch } =
        containerRef.current.getBoundingClientRect();
      if (cw === 0 || ch === 0) return;

      const PAGE_RATIO = pageRatioRef.current;
      const isMobile = cw < 768;

      if (isMobile) {
        const pageW = Math.floor(cw);
        let pageH = Math.floor(pageW / PAGE_RATIO);
        if (pageH > ch) {
          pageH = Math.floor(ch);
        }
        setDims({ pageW, pageH, wrapW: pageW, wrapH: pageH, isMobile: true });
      } else {
        const bookWIfH = 2 * ch * PAGE_RATIO;
        let pageW: number, pageH: number;
        if (bookWIfH <= cw) {
          pageH = Math.floor(ch);
          pageW = Math.floor(ch * PAGE_RATIO);
        } else {
          pageW = Math.floor(cw / 2);
          pageH = Math.floor(pageW / PAGE_RATIO);
        }
        setDims({ pageW, pageH, wrapW: pageW * 2, wrapH: pageH, isMobile: false });
      }
    }

    if (pages.length > 0) {
      const img = new window.Image();
      img.onload = () => {
        if (cancelled) return;
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          pageRatioRef.current = img.naturalWidth / img.naturalHeight;
        }
        computeDims();
      };
      img.onerror = () => {
        if (!cancelled) computeDims();
      };
      img.src = pages[0].imageUrl;
    } else {
      computeDims();
    }

    function onResize() {
      computeDims();
    }

    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
  }, [pages]);

  const viewTrackedRef = useRef(false);

  const onFlip = useCallback(
    (e: { data: number }) => {
      setCurrentPage(e.data);

      if (!viewTrackedRef.current && magazineId) {
        const key = `viewed:magazine:${magazineId}`;
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, "1");
          fetch("/api/views", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "magazine", id: magazineId }),
          });
        }
        viewTrackedRef.current = true;
      }
    },
    [magazineId]
  );

  const onChangeOrientation = useCallback(
    (e: { data: string }) => {
      setIsPortrait(e.data === "portrait");
    },
    []
  );

  const flipPrev = useCallback(() => {
    if (currentPage <= 0) return;

    if (dims?.isMobile) {
      // Mobile: use custom CSS 3D flip overlay (left→right)
      setMobilePrevFlip({
        prevPage: pages[currentPage - 1],
        currentPage: pages[currentPage],
      });
    } else {
      // Desktop: use react-pageflip
      const pf = bookRef.current?.pageFlip();
      if (pf) pf.flipPrev("top");
    }
  }, [currentPage, dims?.isMobile, pages]);

  const flipNext = useCallback(() => {
    const pf = bookRef.current?.pageFlip();
    if (!pf) return;
    if (currentPage < pages.length - 1) {
      pf.flipNext("top");
    }
  }, [currentPage, pages.length]);

  const handleMobilePrevComplete = useCallback(() => {
    // Animation done — tell react-pageflip to go to prev page (instant, no animation)
    const pf = bookRef.current?.pageFlip();
    if (pf) {
      pf.turnToPage(currentPage - 1);
    }
    setMobilePrevFlip(null);
  }, [currentPage]);

  // Keyboard
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") flipPrev();
      if (e.key === "ArrowRight") flipNext();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [flipPrev, flipNext]);

  const total = pages.length;
  const isSingle = isPortrait || (dims?.isMobile ?? false);
  const displayPage = isSingle
    ? `${currentPage + 1}`
    : `${currentPage + 1}-${Math.min(currentPage + 2, total)}`;
  const canPrev = currentPage > 0;
  const canNext = isSingle
    ? currentPage + 1 < total
    : currentPage + 2 < total;

  const ready = HTMLFlipBook && dims;

  return (
    <div className="flex h-full flex-col">
      <div
        ref={containerRef}
        className="flex flex-1 items-center justify-center overflow-hidden"
      >
        {!ready && <div className="text-gray-500">Loading...</div>}
        {ready && (
          <div
            style={{
              width: dims.isMobile ? dims.pageW : dims.wrapW,
              height: dims.wrapH,
            }}
            className="relative flex-shrink-0"
          >
            <HTMLFlipBook
              ref={bookRef}
              width={dims.pageW}
              height={dims.pageH}
              size="fixed"
              minWidth={100}
              maxWidth={2000}
              minHeight={100}
              maxHeight={2000}
              drawShadow={true}
              maxShadowOpacity={dims.isMobile ? 0.3 : 0.4}
              showCover={false}
              flippingTime={dims.isMobile ? 600 : 800}
              usePortrait={true}
              startPage={0}
              startZIndex={0}
              autoSize={false}
              mobileScrollSupport={true}
              clickEventForward={false}
              useMouseEvents={true}
              swipeDistance={dims.isMobile ? 20 : 30}
              showPageCorners={!dims.isMobile}
              disableFlipByClick={false}
              onFlip={onFlip}
              onChangeOrientation={onChangeOrientation}
              className=""
              style={{}}
            >
              {pages.map((page) => (
                <FlipPage key={page.id} page={page} />
              ))}
            </HTMLFlipBook>

            {/* Mobile prev: CSS 3D flip overlay */}
            {mobilePrevFlip && dims.isMobile && (
              <MobilePrevFlipOverlay
                prevPage={mobilePrevFlip.prevPage}
                currentPage={mobilePrevFlip.currentPage}
                pageW={dims.pageW}
                pageH={dims.pageH}
                onComplete={handleMobilePrevComplete}
              />
            )}
          </div>
        )}
      </div>
      <Controls
        onPrev={flipPrev}
        onNext={flipNext}
        canPrev={canPrev && !mobilePrevFlip}
        canNext={canNext && !mobilePrevFlip}
        label={`${displayPage} / ${total}`}
      />
    </div>
  );
}
