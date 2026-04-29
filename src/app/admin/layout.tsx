import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LogoutButton } from "./LogoutButton";
import {
  LayoutDashboard,
  Briefcase,
  Wrench,
  GraduationCap,
  Building2,
  FileText,
  Globe2
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "لوحة القيادة", icon: LayoutDashboard },
  { href: "/admin/jobs", label: "الوظائف", icon: Briefcase },
  { href: "/admin/skills", label: "المهارات", icon: Wrench },
  { href: "/admin/courses", label: "الكورسات", icon: GraduationCap },
  { href: "/admin/platforms", label: "منصات التعلم", icon: Globe2 },
  { href: "/admin/companies", label: "الشركات", icon: Building2 },
  { href: "/admin/reports", label: "التقارير", icon: FileText }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-stone-50">
      <aside className="md:w-64 md:fixed md:inset-y-0 md:right-0 bg-white border-l border-stone-100 z-30">
        <div className="p-5 border-b border-stone-100">
          <Link href="/admin">
            <Logo />
          </Link>
        </div>
        <nav className="p-3 space-y-1 overflow-x-auto md:overflow-visible">
          <div className="flex md:block gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-700 hover:bg-brand-50 hover:text-brand-700 transition whitespace-nowrap"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="p-3 mt-auto md:absolute md:bottom-0 md:right-0 md:left-0 border-t border-stone-100">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 md:mr-64 p-4 md:p-8">{children}</main>
    </div>
  );
}
