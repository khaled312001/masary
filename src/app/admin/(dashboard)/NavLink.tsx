"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

export function NavLink({
  href,
  label,
  icon: Icon,
  exact
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition whitespace-nowrap relative ${
        active
          ? "bg-gradient-to-l from-brand-600 to-brand-700 text-white shadow-md shadow-brand-600/20"
          : "text-stone-700 hover:bg-brand-50 hover:text-brand-700"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}
