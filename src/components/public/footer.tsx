import Link from "next/link";
import { ScrollToTopButton } from "./scroll-to-top-button";

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="mx-auto max-w-7xl px-6">
        {/* Top section */}
        <div className="flex items-center justify-between border-b border-white/10 py-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-white">
            STAGE
          </Link>
          <ScrollToTopButton />
        </div>

        {/* Main content */}
        <div className="grid items-start gap-10 py-10 md:grid-cols-[1fr_auto]">
          {/* Company info */}
          <div className="space-y-5 text-sm leading-relaxed">
            <div className="flex gap-3">
              <span className="w-28 shrink-0 text-gray-500">주소</span>
              <span className="text-gray-300">서울특별시 관악구 남부순환로 266길 21 B1</span>
            </div>

            <div className="grid gap-x-12 gap-y-2.5 sm:grid-cols-2">
              <div className="flex gap-3">
                <span className="w-28 shrink-0 text-gray-500">이메일</span>
                <a href="mailto:voceverdiana@naver.com" className="transition-colors hover:text-white">voceverdiana@naver.com</a>
              </div>
              <div className="flex gap-3">
                <span className="w-28 shrink-0 text-gray-500">Tel.</span>
                <a href="tel:010-5235-8025" className="transition-colors hover:text-white">010-5235-8025</a>
              </div>
              <div className="flex gap-3">
                <span className="w-28 shrink-0 text-gray-500">대표발행인</span>
                <span>박경준</span>
              </div>
              <div className="flex gap-3">
                <span className="w-28 shrink-0 text-gray-500">발행기획</span>
                <span>아트컴퍼니본</span>
              </div>
              <div className="flex gap-3">
                <span className="w-28 shrink-0 text-gray-500">사업자등록번호</span>
                <span>116-81-95607</span>
              </div>
              <div className="flex gap-3">
                <span className="w-28 shrink-0 text-gray-500">AI 기술</span>
                <span>(주) 카이로스</span>
              </div>
              <div className="flex gap-3">
                <span className="w-28 shrink-0 text-gray-500">개인정보관리책임자</span>
                <span>최재웅</span>
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-row gap-6 text-sm md:flex-col md:gap-3">
            <a href="#" className="transition-colors hover:text-white">
              회사소개
            </a>
            <a href="#" className="transition-colors hover:text-white">
              이용약관
            </a>
            <a href="#" className="font-medium text-gray-300 transition-colors hover:text-white">
              개인정보취급방침
            </a>
            <a href="#" className="transition-colors hover:text-white">
              저작권
            </a>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6">
          <p className="text-xs text-gray-600">
            Copyright &copy; 2026 스테이지. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
