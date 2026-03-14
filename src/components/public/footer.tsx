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
        <div className="grid gap-10 py-10 md:grid-cols-[1fr_auto]">
          {/* Company info */}
          <div className="space-y-4 text-sm leading-relaxed">
            <p className="text-gray-300">
              (우) 06018 서울특별시 강남구 테헤란로 427 위워크타워 10층
            </p>
            <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              <div className="flex gap-3">
                <span className="w-[7.5rem] shrink-0 text-gray-500">이메일</span>
                <span>bonstage.mag@gmail.com</span>
              </div>
              <div className="flex gap-3">
                <span className="w-[7.5rem] shrink-0 text-gray-500">Tel.</span>
                <span>000-0000-0000</span>
              </div>
              <div className="flex gap-3">
                <span className="w-[7.5rem] shrink-0 text-gray-500">사업자등록번호</span>
                <span>548-87-03325</span>
              </div>
              <div className="flex gap-3">
                <span className="w-[7.5rem] shrink-0 text-gray-500">통신판매신고번호</span>
                <span>제0000-00000-0000호</span>
              </div>
              <div className="flex gap-3">
                <span className="w-[7.5rem] shrink-0 text-gray-500">대표발행인</span>
                <span>박경준</span>
              </div>
              <div className="flex gap-3">
                <span className="w-[7.5rem] shrink-0 text-gray-500">대표자</span>
                <span>백민자</span>
              </div>
              <div className="flex gap-3">
                <span className="w-[7.5rem] shrink-0 text-gray-500">개인정보관리책임자</span>
                <span>박일남</span>
              </div>
              <div className="flex gap-3">
                <span className="w-[7.5rem] shrink-0 text-gray-500">청소년보호책임자</span>
                <span>OOO</span>
              </div>
              <div className="flex gap-3">
                <span className="w-[7.5rem] shrink-0 text-gray-500">호스팅</span>
                <span>카이로스</span>
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
