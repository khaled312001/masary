import { AnalyzeForm } from "./AnalyzeForm";
import { apiServerSafe } from "@/lib/api";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

type Job = { id: string; titleAr: string };
type Company = { id: string; nameAr: string };
type Skill = { id: string; nameAr: string };

export default async function AnalyzePage() {
  const [jobsRes, companiesRes, skillsRes] = await Promise.all([
    apiServerSafe<Job[]>("/api/jobs"),
    apiServerSafe<Company[]>("/api/companies"),
    apiServerSafe<Skill[]>("/api/skills")
  ]);

  const jobs = (jobsRes.data ?? []).map((j) => ({ id: j.id, titleAr: j.titleAr }));
  const companies = (companiesRes.data ?? []).map((c) => ({ id: c.id, nameAr: c.nameAr }));
  const skills = (skillsRes.data ?? []).map((s) => ({ id: s.id, nameAr: s.nameAr }));

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
      <AnalyzeForm jobs={jobs} companies={companies} skills={skills} />
    </div>
  );
}
