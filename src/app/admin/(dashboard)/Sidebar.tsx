"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { LogoutButton } from "./LogoutButton";
import {
  LayoutDashboard,
  Briefcase,
  Wrench,
  GraduationCap,
  Building2,
  FileText,
  Globe2,
  Sparkles,
  Settings as SettingsIcon,
  Menu,
  X,
  type LucideIcon
} from "lucide-react";

type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean };

const navItems: NavItem[] = [
  { href: "/admin", label: "لوحة القيادة", icon: LayoutDashboard, exact: true },
  { href: "/admin/analyze", label: "تحليل جديد", icon: Sparkles },
  { href: "/admin/jobs", label: "الوظائف", icon: Briefcase },
  { href: "/admin/skills", label: "المهارات", icon: Wrench },
  { href: "/admin/courses", label: "الكورسات", icon: GraduationCap },
  { href: "/admin/platforms", label: "منصات التعلم", icon: Globe2 },
  { href: "/admin/companies", label: "الشركات", icon: Building2 },
  { href: "/admin/reports", label: "التقارير", icon: FileText },
  { href: "/admin/settings", label: "الإعدادات", icon: SettingsIcon }
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close drawer on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const activeItem = navItems.find((item) =>
    item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(item.href + "/")
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-100 px-4 h-14 flex items-center justify-between">
        <Link href="/admin" className="hover:opacity-80 transition">
          <Logo size={32} />
        </Link>
        <div className="flex items-center gap-2">
          {activeItem && (
            <span className="text-sm font-semibold text-stone-700 hidden sm:inline">
              {activeItem.label}
            </span>
          )}
          <button
            onClick={() => setOpen(true)}
            aria-label="فتح القائمة"
            className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center hover:bg-brand-100 active:scale-95 transition"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Drawer overlay (mobile) */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar — drawer on mobile, fixed on desktop */}
      <aside
        className={`
          fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] bg-white shadow-2xl md:shadow-none
          border-l border-stone-100 flex flex-col
          transform transition-transform duration-300 ease-out
          md:w-64 md:translate-x-0
          ${open ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <Link href="/admin" className="hover:opacity-80 transition">
            <Logo />
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="إغلاق"
            className="md:hidden w-9 h-9 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition relative ${
                  active
                    ? "bg-gradient-to-l from-brand-600 to-brand-700 text-white shadow-md shadow-brand-600/20"
                    : "text-stone-700 hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-white/80" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-stone-100">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
