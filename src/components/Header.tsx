"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { Sparkles, Menu, X } from "lucide-react";

const links = [
  { href: "/#how", label: "كيف يعمل" },
  { href: "/#features", label: "الميزات" },
  { href: "/#audience", label: "لمن مساري" },
  { href: "/#companies", label: "شركاؤنا" }
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 no-print transition-all duration-300 ${
          scrolled
            ? "bg-white/85 backdrop-blur-xl border-b border-stone-100 shadow-sm"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" aria-label="الصفحة الرئيسية" className="hover:opacity-80 transition shrink-0">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-stone-600 hover:text-brand-700 hover:bg-brand-50/50 transition"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/analyze"
              className="hidden md:inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold px-4 py-2 text-sm transition-all shadow-md shadow-brand-600/20 hover:shadow-lg active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              ابدأ التحليل
            </Link>

            <button
              onClick={() => setOpen(true)}
              aria-label="فتح القائمة"
              className="md:hidden w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center hover:bg-brand-100 active:scale-95 transition"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      <aside
        className={`md:hidden fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] bg-white shadow-2xl border-l border-stone-100 flex flex-col transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <Logo />
          <button
            onClick={() => setOpen(false)}
            aria-label="إغلاق"
            className="w-9 h-9 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-3 space-y-1 flex-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-stone-700 hover:bg-brand-50 hover:text-brand-700 transition"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-stone-100">
          <Link
            href="/analyze"
            onClick={() => setOpen(false)}
            className="btn-primary w-full text-sm"
          >
            <Sparkles className="w-4 h-4" />
            ابدأ التحليل
          </Link>
        </div>
      </aside>
    </>
  );
}
