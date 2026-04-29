import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Briefcase, Wrench, GraduationCap, Building2, FileText, Globe2 } from "lucide-react";

export const dynamic = "force-dynamic";

async function getCounts() {
  try {
    const [jobs, skills, courses, platforms, companies, reports] = await Promise.all([
      prisma.job.count(),
      prisma.skill.count(),
      prisma.course.count(),
      prisma.platform.count(),
      prisma.company.count(),
      prisma.report.count()
    ]);
    return { jobs, skills, courses, platforms, companies, reports };
  } catch {
    return { jobs: 0, skills: 0, courses: 0, platforms: 0, companies: 0, reports: 0 };
  }
}

export default async function AdminHome() {
  const counts = await getCounts();
  const cards = [
    { href: "/admin/jobs", label: "الوظائف", count: counts.jobs, icon: Briefcase, color: "bg-blue-50 text-blue-700" },
    { href: "/admin/skills", label: "المهارات", count: counts.skills, icon: Wrench, color: "bg-purple-50 text-purple-700" },
    { href: "/admin/courses", label: "الكورسات", count: counts.courses, icon: GraduationCap, color: "bg-emerald-50 text-emerald-700" },
    { href: "/admin/platforms", label: "منصات التعلم", count: counts.platforms, icon: Globe2, color: "bg-amber-50 text-amber-700" },
    { href: "/admin/companies", label: "الشركات", count: counts.companies, icon: Building2, color: "bg-rose-50 text-rose-700" },
    { href: "/admin/reports", label: "التقارير المُولّدة", count: counts.reports, icon: FileText, color: "bg-indigo-50 text-indigo-700" }
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900">لوحة القيادة</h1>
        <p className="text-stone-600 mt-1">نظرة سريعة على بيانات المنصة</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="card hover:shadow-md transition group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.color}`}>
              <c.icon className="w-6 h-6" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-stone-900">{c.count}</div>
              <div className="text-sm text-stone-600 mt-1">{c.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
