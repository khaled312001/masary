import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Briefcase,
  Wrench,
  GraduationCap,
  Building2,
  FileText,
  Globe2,
  Sparkles,
  TrendingUp,
  ArrowLeft
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const [jobs, skills, courses, platforms, companies, reports, latestReports] = await Promise.all([
      prisma.job.count(),
      prisma.skill.count(),
      prisma.course.count(),
      prisma.platform.count(),
      prisma.company.count(),
      prisma.report.count(),
      prisma.report.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, fullName: true, jobTitle: true, createdAt: true }
      })
    ]);
    return { jobs, skills, courses, platforms, companies, reports, latestReports };
  } catch {
    return {
      jobs: 0, skills: 0, courses: 0, platforms: 0, companies: 0, reports: 0,
      latestReports: [] as { id: string; fullName: string; jobTitle: string; createdAt: Date }[]
    };
  }
}

export default async function AdminHome() {
  const data = await getData();
  const cards = [
    { href: "/admin/jobs", label: "الوظائف", count: data.jobs, icon: Briefcase, color: "from-blue-500 to-blue-700", bg: "bg-blue-50" },
    { href: "/admin/skills", label: "المهارات", count: data.skills, icon: Wrench, color: "from-purple-500 to-purple-700", bg: "bg-purple-50" },
    { href: "/admin/courses", label: "الكورسات", count: data.courses, icon: GraduationCap, color: "from-emerald-500 to-emerald-700", bg: "bg-emerald-50" },
    { href: "/admin/platforms", label: "منصات التعلم", count: data.platforms, icon: Globe2, color: "from-amber-500 to-amber-700", bg: "bg-amber-50" },
    { href: "/admin/companies", label: "الشركات", count: data.companies, icon: Building2, color: "from-rose-500 to-rose-700", bg: "bg-rose-50" },
    { href: "/admin/reports", label: "التقارير", count: data.reports, icon: FileText, color: "from-indigo-500 to-indigo-700", bg: "bg-indigo-50" }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 text-white p-6 md:p-10 shadow-xl">
        <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-gold-400/15 blur-3xl pointer-events-none animate-pulse-slow" />
        <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-brand-300/20 blur-3xl pointer-events-none animate-pulse-slow" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              لوحة قيادة مساري
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold">أهلاً بك في لوحة التحكم</h1>
            <p className="text-white/80 mt-1 max-w-lg">
              من هنا تدير بيانات المنصة وتُصدر التقارير للمستخدمين
            </p>
          </div>
          <Link
            href="/admin/analyze"
            className="inline-flex items-center gap-2 rounded-xl bg-white text-brand-800 hover:bg-gold-50 px-5 py-3 font-bold shadow-lg shadow-black/10 transition hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-5 h-5" />
            تحليل جديد للمستخدم
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <Link
            key={c.href}
            href={c.href}
            className="group relative overflow-hidden rounded-2xl bg-white border border-stone-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-0 group-hover:opacity-[0.04] transition-opacity`} />
            <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <c.icon className="w-6 h-6 text-stone-700" />
            </div>
            <div className="mt-4 relative">
              <div className="text-3xl font-extrabold text-stone-900">{c.count}</div>
              <div className="text-sm text-stone-600 mt-1 flex items-center justify-between">
                {c.label}
                <ArrowLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Latest reports */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-600" />
            آخر التقارير
          </h2>
          <Link href="/admin/reports" className="text-sm text-brand-700 hover:underline">
            عرض الكل
          </Link>
        </div>
        {data.latestReports.length === 0 ? (
          <div className="text-center py-8 text-stone-500 text-sm">
            لم يتم إنشاء تقارير بعد. ابدأ بإنشاء تحليل جديد.
          </div>
        ) : (
          <div className="space-y-2">
            {data.latestReports.map((r) => (
              <Link
                key={r.id}
                href={`/report/${r.id}`}
                target="_blank"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition border border-stone-100"
              >
                <div>
                  <div className="font-semibold text-stone-900 text-sm">{r.fullName}</div>
                  <div className="text-xs text-stone-500">{r.jobTitle}</div>
                </div>
                <div className="text-xs text-stone-400">
                  {new Date(r.createdAt).toLocaleDateString("ar-SA")}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
