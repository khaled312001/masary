"use client";

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
  { href: "/admin/reports", label: "التقارير", icon: FileText }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="md:w-64 md:fixed md:inset-y-0 md:right-0 bg-white border-l border-stone-100 z-30 flex flex-col">
      <div className="p-5 border-b border-stone-100">
        <Link href="/admin" className="hover:opacity-80 transition">
          <Logo />
        </Link>
      </div>
      <nav className="p-3 space-y-1 overflow-x-auto md:overflow-visible flex-1">
        <div className="flex md:block gap-1">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition whitespace-nowrap relative ${
                  active
                    ? "bg-gradient-to-l from-brand-600 to-brand-700 text-white shadow-md shadow-brand-600/20"
                    : "text-stone-700 hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="p-3 border-t border-stone-100">
        <LogoutButton />
      </div>
    </aside>
  );
}
