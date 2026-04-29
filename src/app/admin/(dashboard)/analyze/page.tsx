import { prisma } from "@/lib/prisma";
import { AnalyzeForm } from "./AnalyzeForm";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnalyzePage() {
  const [jobs, companies] = await Promise.all([
    prisma.job.findMany({ select: { id: true, titleAr: true }, orderBy: { titleAr: "asc" } }).catch(() => []),
    prisma.company.findMany({ select: { id: true, nameAr: true }, orderBy: { nameAr: "asc" } }).catch(() => [])
  ]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-100 px-4 py-1.5 text-xs font-medium text-brand-700">
          <Sparkles className="w-3.5 h-3.5" />
          إصدار تقرير جديد
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-stone-900">تحليل مهارات مستخدم جديد</h1>
        <p className="mt-2 text-stone-600">أدخل بيانات المستخدم وسنصدر له تقريراً مفصلاً بالمسار التعليمي</p>
      </div>
      <AnalyzeForm jobs={jobs} companies={companies} />
    </div>
  );
}
