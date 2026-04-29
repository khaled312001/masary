"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, User2, Briefcase, Building2, Wrench, BookOpen } from "lucide-react";

type Option = { id: string; titleAr?: string; nameAr?: string };

export function AnalyzeForm({ jobs, companies }: { jobs: Option[]; companies: Option[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    jobTitle: "",
    employer: "",
    currentSkills: "",
    currentCourses: ""
  });

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.fullName.trim() || !form.jobTitle.trim() || !form.currentSkills.trim()) {
      setError("الرجاء تعبئة الحقول الأساسية: الاسم والمسمى الوظيفي والمهارات الحالية.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "حدث خطأ غير متوقع");
      router.push(`/report/${data.id}`);
    } catch (err: any) {
      setError(err.message || "تعذر إنشاء التقرير");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="card !p-6 md:!p-8 space-y-5">
      <Field icon={User2} label="الاسم الكامل" required>
        <input
          className="input"
          placeholder="مثلاً: عبدالله العتيبي"
          value={form.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          maxLength={100}
        />
      </Field>

      <Field icon={Briefcase} label="المسمى الوظيفي المستهدف" required hint="مثل: مهندس بيانات، أخصائي موارد بشرية، مطور ويب">
        <input
          list="jobs-list"
          className="input"
          placeholder="اكتب المسمى الوظيفي"
          value={form.jobTitle}
          onChange={(e) => update("jobTitle", e.target.value)}
          maxLength={120}
        />
        <datalist id="jobs-list">
          {jobs.map((j) => (
            <option key={j.id} value={j.titleAr} />
          ))}
        </datalist>
      </Field>

      <Field icon={Building2} label="جهة العمل المستهدفة (اختياري)" hint="مثل: أرامكو، معادن، الراجحي، مدن">
        <input
          list="companies-list"
          className="input"
          placeholder="جهة العمل"
          value={form.employer}
          onChange={(e) => update("employer", e.target.value)}
          maxLength={120}
        />
        <datalist id="companies-list">
          {companies.map((c) => (
            <option key={c.id} value={c.nameAr} />
          ))}
        </datalist>
      </Field>

      <Field icon={Wrench} label="مهاراتك الحالية" required hint="افصل المهارات بفاصلة: SQL, Excel, Python, التحليل المالي">
        <textarea
          className="input min-h-28 resize-y"
          placeholder="مثال: التواصل، Excel، تحليل البيانات، اللغة الإنجليزية..."
          value={form.currentSkills}
          onChange={(e) => update("currentSkills", e.target.value)}
          maxLength={2000}
        />
      </Field>

      <Field icon={BookOpen} label="الدورات التدريبية الحالية (اختياري)" hint="اذكر أي شهادات أو دورات أتممتها">
        <textarea
          className="input min-h-20 resize-y"
          placeholder="مثال: Google Data Analytics، CMA الجزء الأول، PMP..."
          value={form.currentCourses}
          onChange={(e) => update("currentCourses", e.target.value)}
          maxLength={2000}
        />
      </Field>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <button type="submit" className="btn-primary w-full text-base" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            جارٍ تحليل بياناتك...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            احصل على تقريري الآن
          </>
        )}
      </button>

      <p className="text-xs text-stone-500 text-center">
        التحليل يستغرق عادة 10-30 ثانية. سنحفظ التقرير برقم خاص يمكنك العودة إليه.
      </p>
    </form>
  );
}

function Field({
  icon: Icon,
  label,
  required,
  hint,
  children
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label flex items-center gap-2">
        <Icon className="w-4 h-4 text-brand-600" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-stone-500">{hint}</p>}
    </div>
  );
}
