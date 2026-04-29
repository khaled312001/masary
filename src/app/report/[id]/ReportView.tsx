"use client";

import type { AnalysisReport } from "@/lib/ai";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Printer,
  Share2,
  Sparkles,
  Trophy,
  BookOpen,
  ExternalLink,
  Building2,
  ArrowLeft,
  Lightbulb,
  Target
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Props = {
  report: {
    id: string;
    fullName: string;
    jobTitle: string;
    employer: string | null;
    createdAt: string;
    data: AnalysisReport;
  };
};

export function ReportView({ report }: Props) {
  const { data } = report;
  const [copied, setCopied] = useState(false);

  function shareLink() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: "تقرير مساري", url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card !p-6 md:!p-8 bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 text-white border-none relative overflow-hidden animate-scale-in">
        <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-gold-400/20 blur-3xl pointer-events-none animate-pulse-slow" />
        <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-brand-300/20 blur-3xl pointer-events-none animate-pulse-slow" />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                تقرير مساري الذكي
              </div>
              <h1 className="mt-3 text-2xl md:text-3xl font-extrabold">{report.fullName}</h1>
              <p className="text-white/80 mt-1">
                المسمى الوظيفي: <span className="font-semibold">{report.jobTitle}</span>
                {report.employer && (
                  <>
                    {" "}
                    — جهة العمل: <span className="font-semibold">{report.employer}</span>
                  </>
                )}
              </p>
              <p className="text-white/60 text-xs mt-1">
                تاريخ الإصدار: {new Date(report.createdAt).toLocaleDateString("ar-SA")}
              </p>
            </div>
            <ScoreCircle score={data.matchScore} />
          </div>

          <div className="mt-6 flex flex-wrap gap-2 no-print">
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur px-4 py-2 text-sm font-semibold transition">
              <Printer className="w-4 h-4" /> طباعة
            </button>
            <button onClick={shareLink} className="inline-flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur px-4 py-2 text-sm font-semibold transition">
              <Share2 className="w-4 h-4" /> {copied ? "تم النسخ" : "مشاركة"}
            </button>
            <Link href="/admin/analyze" className="inline-flex items-center gap-2 rounded-xl bg-white text-brand-700 hover:bg-gold-50 px-4 py-2 text-sm font-semibold transition active:scale-95">
              <ArrowLeft className="w-4 h-4" /> تحليل جديد
            </Link>
          </div>
        </div>
      </div>

      {/* Encouragement */}
      {data.encouragement && (
        <div className="card border-r-4 !border-r-gold-400 animate-slide-up bg-gradient-to-l from-gold-50/50 to-transparent" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-gold-600" />
            </div>
            <p className="text-stone-700 leading-relaxed mt-1">{data.encouragement}</p>
          </div>
        </div>
      )}

      {/* Summary */}
      {data.summary && (
        <section className="card">
          <h2 className="section-title flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-600" />
            ملخص التحليل
          </h2>
          <p className="text-stone-700 leading-loose">{data.summary}</p>
        </section>
      )}

      {/* Skills Grid */}
      <section className="grid md:grid-cols-3 gap-4">
        <SkillsCard
          title="مهاراتك الحالية"
          icon={CheckCircle2}
          tone="green"
          items={data.presentSkills.map((s) => ({ name: s.name, note: s.note }))}
          empty="لم يتم رصد مهارات مطابقة بشكل كامل"
        />
        <SkillsCard
          title="مهارات تحتاج تطوير"
          icon={AlertCircle}
          tone="amber"
          items={data.partialSkills.map((s) => ({ name: s.name, note: s.note }))}
          empty="لا توجد مهارات جزئية"
        />
        <SkillsCard
          title="فجوات مهاراتك"
          icon={XCircle}
          tone="red"
          items={data.missingSkills.map((s) => ({ name: s.name, note: s.note, importance: s.importance }))}
          empty="ممتاز! لا توجد فجوات كبيرة"
        />
      </section>

      {/* Learning Path */}
      {data.learningPath?.length > 0 && (
        <section className="card">
          <h2 className="section-title flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gold-500" />
            مسار التعلم المقترح
          </h2>
          <div className="relative space-y-4 pr-6 mt-4">
            <div className="absolute right-2.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-brand-400 via-brand-300 to-gold-300" />
            {data.learningPath.map((step) => (
              <div key={step.step} className="relative">
                <div className="absolute -right-6 top-1 w-5 h-5 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 ring-4 ring-white text-white text-[10px] font-bold flex items-center justify-center">
                  {step.step}
                </div>
                <div className="rounded-2xl border border-stone-100 bg-stone-50/60 p-5">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <h3 className="font-bold text-stone-900">{step.title}</h3>
                    <span className="pill bg-brand-100 text-brand-700">~ {step.durationWeeks} أسبوع</span>
                  </div>
                  {step.description && (
                    <p className="mt-2 text-sm text-stone-600 leading-relaxed">{step.description}</p>
                  )}
                  {step.skills?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {step.skills.map((s) => (
                        <span key={s} className="pill bg-white border border-stone-200 text-stone-700">{s}</span>
                      ))}
                    </div>
                  )}
                  {step.courses?.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {step.courses.map((c, i) => (
                        <CourseLink key={i} title={c.title} platform={c.platform} url={c.url} isFree={c.isFree} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Suggested Courses */}
      {data.suggestedCourses?.length > 0 && (
        <section className="card">
          <h2 className="section-title flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-600" />
            دورات مقترحة إضافية
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {data.suggestedCourses.map((c, i) => (
              <div key={i} className="rounded-xl border border-stone-100 p-4 bg-stone-50/50">
                <h4 className="font-semibold text-stone-900">{c.title}</h4>
                {c.platform && <p className="text-xs text-stone-500 mt-0.5">{c.platform}</p>}
                <p className="text-sm text-stone-600 mt-2 leading-relaxed">{c.reason}</p>
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-900"
                  >
                    رابط الكورس <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Suggested Employers */}
      {data.suggestedEmployers?.length > 0 && (
        <section className="card">
          <h2 className="section-title flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-600" />
            جهات عمل مقترحة
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {data.suggestedEmployers.map((e, i) => (
              <div key={i} className="rounded-xl border border-stone-100 p-4 bg-stone-50/50">
                <h4 className="font-semibold text-stone-900">{e.name}</h4>
                <p className="text-sm text-stone-600 mt-2 leading-relaxed">{e.reason}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Final Advice */}
      {data.finalAdvice && (
        <section className="card bg-gradient-to-br from-gold-50 to-brand-50 border-gold-200">
          <h2 className="section-title flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-600" />
            نصيحة ختامية
          </h2>
          <p className="text-stone-800 leading-loose">{data.finalAdvice}</p>
        </section>
      )}
    </div>
  );
}

function ScoreCircle({ score }: { score: number }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const tone = score >= 75 ? "stroke-gold-300" : score >= 50 ? "stroke-white" : "stroke-red-300";
  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} className="stroke-white/20" strokeWidth="8" fill="none" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          className={tone}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-extrabold">{score}%</div>
        <div className="text-[10px] text-white/80 -mt-1">نسبة التطابق</div>
      </div>
    </div>
  );
}

function SkillsCard({
  title,
  icon: Icon,
  tone,
  items,
  empty
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "green" | "amber" | "red";
  items: { name: string; note?: string; importance?: number }[];
  empty: string;
}) {
  const toneClasses = {
    green: "from-green-50 to-emerald-50 text-green-700 border-green-100",
    amber: "from-amber-50 to-yellow-50 text-amber-700 border-amber-100",
    red: "from-red-50 to-rose-50 text-red-700 border-red-100"
  }[tone];

  const pillClasses = {
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700"
  }[tone];

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 ${toneClasses}`}>
      <div className="flex items-center gap-2 font-bold">
        <Icon className="w-5 h-5" />
        {title}
        <span className="text-xs ms-auto opacity-70">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="mt-4 text-sm opacity-70">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((it, i) => (
            <li key={i} className="text-sm">
              <div className="flex items-center gap-2">
                <span className={`pill ${pillClasses}`}>{it.name}</span>
                {it.importance && (
                  <span className="text-[10px] opacity-70">أهمية {it.importance}/5</span>
                )}
              </div>
              {it.note && <p className="mt-1 text-xs opacity-80 ms-1">{it.note}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CourseLink({
  title,
  platform,
  url,
  isFree
}: {
  title: string;
  platform?: string;
  url?: string;
  isFree?: boolean;
}) {
  const Inner = (
    <div className="flex items-start justify-between gap-3 rounded-xl bg-white border border-stone-100 p-3 hover:border-brand-300 hover:shadow-sm transition">
      <div>
        <div className="font-semibold text-stone-900 text-sm">{title}</div>
        {platform && <div className="text-xs text-stone-500 mt-0.5">{platform}</div>}
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {isFree && <span className="pill bg-green-100 text-green-700">مجاني</span>}
        {url && <ExternalLink className="w-4 h-4 text-brand-500" />}
      </div>
    </div>
  );
  if (url) {
    return (
      <a href={url} target="_blank" rel="noreferrer">
        {Inner}
      </a>
    );
  }
  return Inner;
}
