"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  User2,
  Briefcase,
  Building2,
  Wrench,
  BookOpen,
  Brain,
  FileText,
  Upload,
  CheckCircle2,
  X,
  AlertCircle
} from "lucide-react";

type Option = { id: string; titleAr?: string; nameAr?: string };

const MAX_CV_BYTES = 12 * 1024 * 1024;
const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/webp"
];

export function AnalyzeForm({ jobs, companies, skills }: { jobs: Option[]; companies: Option[]; skills: Option[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    jobTitle: "",
    employer: "",
    currentSkills: "",
    currentCourses: ""
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const jobSuggestions = fuzzyOptions(jobs, form.jobTitle, "titleAr", 6);
  const skillFragment = lastListFragment(form.currentSkills);
  const skillSuggestions = fuzzyOptions(skills, skillFragment, "nameAr", 6);

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function applySkillSuggestion(value: string) {
    update("currentSkills", replaceLastListFragment(form.currentSkills, value));
  }

  function validateFile(file: File): string | null {
    if (!ACCEPTED_TYPES.includes(file.type)) return "نوع الملف غير مدعوم";
    if (file.size > MAX_CV_BYTES) return `حجم الملف يتجاوز ${formatBytes(MAX_CV_BYTES)}`;
    if (file.size === 0) return "الملف فارغ";
    return null;
  }

  function handleFile(file: File | null) {
    setFileError(null);
    if (!file) {
      setCvFile(null);
      return;
    }
    const err = validateFile(file);
    if (err) {
      setFileError(err);
      setCvFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setCvFile(file);
  }

  function clearFile() {
    setCvFile(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onDrop(ev: React.DragEvent) {
    ev.preventDefault();
    setDragActive(false);
    const file = ev.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function cancelAnalysis() {
    abortRef.current?.abort();
    setLoading(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.fullName.trim() || !form.jobTitle.trim() || (!form.currentSkills.trim() && !cvFile)) {
      setError("الرجاء تعبئة الاسم والمسمى الوظيفي، ثم إدخال المهارات أو رفع السيرة الذاتية.");
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const body = new FormData();
      body.set("fullName", form.fullName.trim());
      body.set("jobTitle", form.jobTitle.trim());
      if (form.employer.trim()) body.set("employer", form.employer.trim());
      if (form.currentSkills.trim()) body.set("currentSkills", form.currentSkills.trim());
      if (form.currentCourses.trim()) body.set("currentCourses", form.currentCourses.trim());
      if (cvFile) body.set("cv", cvFile);

      const res = await fetch("/api/proxy/api/analyze", { method: "POST", body, signal: controller.signal });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "حدث خطأ غير متوقع");
      if (!data?.id) throw new Error("لم يتم إنشاء التقرير. حاول مرة أخرى.");
      router.push(`/report/${data.id}`);
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setLoading(false);
        return;
      }
      setError(err.message || "تعذر إنشاء التقرير");
      setLoading(false);
    } finally {
      abortRef.current = null;
    }
  }

  if (loading) {
    return (
      <div className="card !p-10 text-center space-y-5 animate-fade-in">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-brand-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-brand-600 border-t-transparent animate-spin"></div>
          <Brain className="absolute inset-0 m-auto w-8 h-8 text-brand-600 animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-stone-900">يعمل الذكاء الاصطناعي على التقرير...</h3>
          <p className="text-sm text-stone-600 mt-1">قد يستغرق التحليل من 15 إلى 40 ثانية</p>
        </div>
        <div className="flex flex-col gap-2 max-w-sm mx-auto text-right">
          <Step text="مطابقة المسمى الوظيفي مع قاعدة البيانات" delay={0} />
          <Step text="تحليل فجوة المهارات" delay={1500} />
          <Step text="رسم مسار التعلم وترشيح الكورسات" delay={3500} />
        </div>
        <button
          type="button"
          onClick={cancelAnalysis}
          className="text-xs text-stone-500 hover:text-red-600 transition underline-offset-2 hover:underline"
        >
          إلغاء التحليل
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card !p-6 md:!p-8 space-y-5 animate-slide-up" noValidate>
      <Field icon={User2} label="الاسم الكامل" required>
        <input
          className="input"
          placeholder="مثلاً: عبدالله العتيبي"
          value={form.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          maxLength={100}
          autoComplete="name"
        />
      </Field>

      <Field icon={Briefcase} label="المسمى الوظيفي المستهدف" required hint="مثل: مهندس بيانات، أخصائي موارد بشرية، مطور ويب">
        <div className="relative">
          <input
            className="input"
            placeholder="اكتب المسمى الوظيفي"
            value={form.jobTitle}
            onChange={(e) => update("jobTitle", e.target.value)}
            maxLength={120}
            autoComplete="off"
          />
          <SuggestionList
            options={jobSuggestions}
            getLabel={(item) => item.titleAr ?? ""}
            onPick={(value) => update("jobTitle", value)}
          />
        </div>
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

      <Field icon={Wrench} label="مهارات المستخدم الحالية" required={!cvFile} hint="افصل المهارات بفاصلة. سنصححها للأقرب ونضيف الجديد.">
        <textarea
          className="input min-h-28 resize-y"
          placeholder="مثال: التواصل، Excel، تحليل البيانات، اللغة الإنجليزية..."
          value={form.currentSkills}
          onChange={(e) => update("currentSkills", e.target.value)}
          maxLength={2000}
        />
        <SuggestionList
          options={skillSuggestions}
          getLabel={(item) => item.nameAr ?? ""}
          onPick={applySkillSuggestion}
        />
      </Field>

      <Field icon={FileText} label="السيرة الذاتية" hint="اختياري — PDF أو Word أو صورة لاستخراج المهارات والكورسات">
        {cvFile ? (
          <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-stone-800 truncate" title={cvFile.name}>
                {cvFile.name}
              </div>
              <div className="text-xs text-stone-500 mt-0.5">{formatBytes(cvFile.size)}</div>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="w-9 h-9 rounded-lg hover:bg-red-50 text-stone-500 hover:text-red-600 flex items-center justify-center transition shrink-0"
              aria-label="حذف الملف"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label
            onDragEnter={(ev) => {
              ev.preventDefault();
              setDragActive(true);
            }}
            onDragOver={(ev) => {
              ev.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 cursor-pointer transition ${
              dragActive
                ? "border-brand-500 bg-brand-50"
                : fileError
                ? "border-red-300 bg-red-50/30"
                : "border-stone-200 hover:border-brand-300 hover:bg-brand-50/30"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-sm font-semibold text-stone-700">اسحب الملف هنا أو انقر للرفع</div>
            <div className="text-[11px] text-stone-500">PDF, DOC, DOCX, PNG, JPG, WEBP — حتى {formatBytes(MAX_CV_BYTES)}</div>
            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              accept=".pdf,.doc,.docx,image/png,image/jpeg,image/webp"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
          </label>
        )}
        {fileError && (
          <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {fileError}
          </p>
        )}
      </Field>

      <Field icon={BookOpen} label="الدورات التدريبية الحالية (اختياري)" hint="اذكر أي شهادات أو دورات أتمها">
        <textarea
          className="input min-h-20 resize-y"
          placeholder="مثال: Google Data Analytics، CMA الجزء الأول، PMP..."
          value={form.currentCourses}
          onChange={(e) => update("currentCourses", e.target.value)}
          maxLength={2000}
        />
      </Field>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm animate-fade-in">
          {error}
        </div>
      )}

      <button type="submit" className="btn-primary w-full text-base" disabled={loading}>
        <Sparkles className="w-5 h-5" />
        إصدار التقرير الآن
      </button>
    </form>
  );
}

function SuggestionList({
  options,
  getLabel,
  onPick
}: {
  options: Option[];
  getLabel: (item: Option) => string;
  onPick: (value: string) => void;
}) {
  if (options.length === 0) return null;

  return (
    <div className="relative z-20">
      <div className="absolute mt-1 w-full overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xl">
        {options.map((item) => {
          const label = getLabel(item);
          return (
            <button
              key={item.id}
              type="button"
              className="block w-full px-3 py-2 text-right text-sm font-semibold text-stone-800 hover:bg-brand-50 hover:text-brand-700"
              onMouseDown={(e) => {
                e.preventDefault();
                onPick(label);
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
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

function fuzzyOptions(options: Option[], query: string, key: "titleAr" | "nameAr", limit: number) {
  const q = normalizeArabic(query);
  if (q.length < 2) return [];

  return options
    .map((item) => {
      const label = item[key] ?? "";
      return { item, label, score: similarity(q, normalizeArabic(label)) };
    })
    .filter((row) => row.label && normalizeArabic(row.label) !== q && row.score >= 0.45)
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label, "ar"))
    .slice(0, limit)
    .map((row) => row.item);
}

function normalizeArabic(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .trim()
    .replace(/[إأٱآا]/g, "ا")
    .replace(/[ىیي]/g, "ي")
    .replace(/[كک]/g, "ك")
    .replace(/[ةۀ]/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ء/g, "")
    .replace(/[ًٌٍَُِّْٰـ]/g, "")
    .replace(/[ﻻﻷﻹﻵ]/g, "لا")
    .replace(/[^\p{L}\p{N}\s+#.]/gu, " ")
    .replace(/\s+/g, " ");
}

function similarity(a: string, b: string) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) {
    return Math.min(0.96, Math.min(a.length, b.length) / Math.max(a.length, b.length) + 0.28);
  }
  const distance = levenshtein(a, b);
  return Math.max(0, 1 - distance / Math.max(a.length, b.length));
}

function levenshtein(a: string, b: string) {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  const curr = Array.from({ length: b.length + 1 }, () => 0);
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }
  return prev[b.length];
}

function lastListFragment(value: string) {
  const parts = value.split(/[,،؛;\n|]/g);
  return parts[parts.length - 1]?.trim() ?? "";
}

function replaceLastListFragment(value: string, replacement: string) {
  const match = value.match(/([,،؛;\n|]\s*)?([^,،؛;\n|]*)$/);
  if (!match || match.index === undefined) return replacement;
  const prefix = value.slice(0, match.index) + (match[1] ?? "");
  return `${prefix}${replacement}`;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
