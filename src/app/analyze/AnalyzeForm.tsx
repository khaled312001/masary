"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, User2, Briefcase, Building2, Wrench, BookOpen, Brain, AlertCircle } from "lucide-react";

type Option = { id: string; titleAr?: string; nameAr?: string };

type FormState = {
  fullName: string;
  jobTitle: string;
  employer: string;
  currentSkills: string;
  currentCourses: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

export function AnalyzeForm({ jobs, companies }: { jobs: Option[]; companies: Option[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState<FormState>({
    fullName: "",
    jobTitle: "",
    employer: "",
    currentSkills: "",
    currentCourses: ""
  });

  function update<K extends keyof FormState>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  }

  function validate(): Errors {
    const e: Errors = {};
    const name = form.fullName.trim();
    if (!name) e.fullName = "أدخل اسمك الكامل";
    else if (name.length < 2) e.fullName = "الاسم قصير جداً";
    else if (name.length > 100) e.fullName = "الاسم طويل جداً";

    const job = form.jobTitle.trim();
    if (!job) e.jobTitle = "أدخل المسمى الوظيفي المستهدف";
    else if (job.length < 2) e.jobTitle = "المسمى قصير جداً";

    const skills = form.currentSkills.trim();
    if (!skills) e.currentSkills = "أدخل مهاراتك الحالية";
    else if (skills.length < 5) e.currentSkills = "اكتب مهاراتك بمزيد من التفصيل";

    return e;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setServerError(null);
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      const firstField = Object.keys(v)[0];
      document.querySelector<HTMLElement>(`[data-field="${firstField}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/proxy/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          jobTitle: form.jobTitle.trim(),
          employer: form.employer.trim() || undefined,
          currentSkills: form.currentSkills.trim(),
          currentCourses: form.currentCourses.trim() || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "تعذر إنشاء التقرير");
      router.push(`/report/${data.id}`);
    } catch (err: any) {
      setServerError(err.message || "تعذر إنشاء التقرير، حاول مرة أخرى");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="card !p-8 md:!p-10 text-center space-y-5 animate-fade-in">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-brand-100" />
          <div className="absolute inset-0 rounded-full border-4 border-brand-600 border-t-transparent animate-spin" />
          <Brain className="absolute inset-0 m-auto w-8 h-8 text-brand-600 animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-stone-900">يعمل الذكاء الاصطناعي على تقريرك...</h3>
          <p className="text-sm text-stone-600 mt-1">قد يستغرق التحليل من 10 إلى 30 ثانية</p>
        </div>
        <div className="flex flex-col gap-2 max-w-sm mx-auto text-right">
          <Step text="مطابقة المسمى الوظيفي مع قاعدة البيانات" delay={0} />
          <Step text="تحليل فجوة المهارات" delay={1500} />
          <Step text="رسم مسار التعلم وترشيح الكورسات" delay={3500} />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card !p-5 md:!p-8 space-y-5">
      <Field
        name="fullName"
        icon={User2}
        label="الاسم الكامل"
        required
        error={errors.fullName}
      >
        <input
          className={`input ${errors.fullName ? "!border-red-300 focus:!border-red-500 focus:!ring-red-100" : ""}`}
          placeholder="مثال: عبدالله العتيبي"
          value={form.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          maxLength={100}
        />
      </Field>

      <Field
        name="jobTitle"
        icon={Briefcase}
        label="المسمى الوظيفي المستهدف"
        required
        hint="مثال: مهندس بيانات، أخصائي موارد بشرية، مطور ويب"
        error={errors.jobTitle}
      >
        <input
          list="jobs-list"
          className={`input ${errors.jobTitle ? "!border-red-300 focus:!border-red-500 focus:!ring-red-100" : ""}`}
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

      <Field
        name="employer"
        icon={Building2}
        label="جهة العمل المستهدفة"
        hint="اختياري — مثل: أرامكو، معادن، الراجحي، مدن"
      >
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

      <Field
        name="currentSkills"
        icon={Wrench}
        label="مهاراتك الحالية"
        required
        hint="افصل المهارات بفاصلة — مثال: SQL, Excel, Python, التحليل المالي"
        error={errors.currentSkills}
      >
        <textarea
          className={`input min-h-28 resize-y ${errors.currentSkills ? "!border-red-300 focus:!border-red-500 focus:!ring-red-100" : ""}`}
          placeholder="مثال: التواصل الفعّال، Microsoft Excel، تحليل البيانات، اللغة الإنجليزية..."
          value={form.currentSkills}
          onChange={(e) => update("currentSkills", e.target.value)}
          maxLength={2000}
        />
        <div className="text-[11px] text-stone-400 mt-1">{form.currentSkills.length} / 2000</div>
      </Field>

      <Field
        name="currentCourses"
        icon={BookOpen}
        label="الدورات والشهادات السابقة"
        hint="اختياري — اذكر أي شهادات أو دورات أتممتها"
      >
        <textarea
          className="input min-h-20 resize-y"
          placeholder="مثال: Google Data Analytics، CMA الجزء الأول، PMP..."
          value={form.currentCourses}
          onChange={(e) => update("currentCourses", e.target.value)}
          maxLength={2000}
        />
      </Field>

      {serverError && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm flex items-start gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <button type="submit" className="btn-primary w-full text-base !py-3.5">
        <Sparkles className="w-5 h-5" />
        إصدار التقرير الآن
      </button>

      <p className="text-center text-[11px] text-stone-400 -mt-2">
        بياناتك تُستخدم فقط لتوليد التقرير ولا تُشارَك مع أي طرف خارجي
      </p>
    </form>
  );
}

function Field({
  name,
  icon: Icon,
  label,
  required,
  hint,
  error,
  children
}: {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-field={name}>
      <label className="label flex items-center gap-2">
        <Icon className="w-4 h-4 text-brand-600" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-stone-500">{hint}</p>
      ) : null}
    </div>
  );
}

function Step({ text, delay }: { text: string; delay: number }) {
  return (
    <div
      className="flex items-center gap-2 text-sm text-stone-600 opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
      {text}
    </div>
  );
}
