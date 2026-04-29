import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LogoutButton } from "./LogoutButton";
import { NavLink } from "./NavLink";
import {
  LayoutDashboard,
  Briefcase,
  Wrench,
  GraduationCap,
  Building2,
  FileText,
  Globe2,
  Sparkles
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "لوحة القيادة", icon: LayoutDashboard, exact: true },
  { href: "/admin/analyze", label: "تحليل جديد", icon: Sparkles },
  { href: "/admin/jobs", label: "الوظائف", icon: Briefcase },
  { href: "/admin/skills", label: "المهارات", icon: Wrench },
  { href: "/admin/courses", label: "الكورسات", icon: GraduationCap },
  { href: "/admin/platforms", label: "منصات التعلم", icon: Globe2 },
  { href: "/admin/companies", label: "الشركات", icon: Building2 },
  { href: "/admin/reports", label: "التقارير", icon: FileText }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-stone-50">
      <aside className="md:w-64 md:fixed md:inset-y-0 md:right-0 bg-white border-l border-stone-100 z-30 flex flex-col">
        <div className="p-5 border-b border-stone-100">
          <Link href="/admin" className="hover:opacity-80 transition">
            <Logo />
          </Link>
        </div>
        <nav className="p-3 space-y-1 overflow-x-auto md:overflow-visible flex-1">
          <div className="flex md:block gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                exact={item.exact}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </div>
        </nav>
        <div className="p-3 border-t border-stone-100">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 md:mr-64 p-4 md:p-8 animate-fade-in">{children}</main>
    </div>
  );
}
