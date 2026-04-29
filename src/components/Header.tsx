import Link from "next/link";
import { Logo } from "./Logo";
import { LogIn } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-100 bg-white/80 backdrop-blur-lg no-print">
      <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" aria-label="الصفحة الرئيسية" className="hover:opacity-90 transition">
          <Logo />
        </Link>
        <nav className="flex items-center gap-2 md:gap-4">
          <Link href="/#how" className="hidden md:inline text-sm text-stone-600 hover:text-brand-700 transition">
            كيف يعمل
          </Link>
          <Link href="/#features" className="hidden md:inline text-sm text-stone-600 hover:text-brand-700 transition">
            الميزات
          </Link>
          <Link href="/admin/login" className="btn-primary !py-2 !px-4 text-sm">
            <LogIn className="w-4 h-4" />
            دخول الإدارة
          </Link>
        </nav>
      </div>
    </header>
  );
}
