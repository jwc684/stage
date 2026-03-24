export function PageSpread({
  leftImage,
  rightImage,
  leftPageNum,
  rightPageNum,
}: {
  leftImage?: string;
  rightImage?: string;
  leftPageNum?: number;
  rightPageNum?: number;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center gap-0.5">
      {leftImage && (
        <div className="relative h-full flex-1">
          <img
            src={leftImage}
            alt={`Page ${leftPageNum}`}
            className="absolute inset-0 h-full w-full object-contain"
            loading={leftPageNum === 1 ? "eager" : "lazy"}
          />
          {leftPageNum && (
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-black/50 px-2 py-0.5 text-xs text-white">
              {leftPageNum}
            </span>
          )}
        </div>
      )}
      {rightImage && (
        <div className="relative h-full flex-1">
          <img
            src={rightImage}
            alt={`Page ${rightPageNum}`}
            className="absolute inset-0 h-full w-full object-contain"
            loading={rightPageNum === 2 ? "eager" : "lazy"}
          />
          {rightPageNum && (
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-black/50 px-2 py-0.5 text-xs text-white">
              {rightPageNum}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
