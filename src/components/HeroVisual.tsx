"use client";

import { CheckCircle2, Sparkles, TrendingUp, BookOpen, Star } from "lucide-react";

export function HeroVisual() {
  return (
    <div className="relative w-full max-w-md mx-auto" aria-hidden>
      {/* Floating skill pills */}
      <div className="absolute -top-3 -right-4 z-10 hidden md:block">
        <FloatingPill text="Python" delay={0} tone="brand" />
      </div>
      <div className="absolute top-24 -left-6 z-10 hidden md:block">
        <FloatingPill text="React" delay={0.6} tone="gold" />
      </div>
      <div className="absolute -bottom-2 right-10 z-10 hidden md:block">
        <FloatingPill text="SQL" delay={1.2} tone="brand" />
      </div>
      <div className="absolute bottom-32 -left-3 z-10 hidden md:block">
        <FloatingPill text="Excel" delay={1.8} tone="gold" />
      </div>

      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-400/20 via-gold-300/15 to-brand-600/20 rounded-3xl blur-2xl" />

      {/* Main report mockup */}
      <div className="relative rounded-3xl bg-white shadow-2xl shadow-brand-900/15 border border-white/60 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 p-5 text-white overflow-hidden">
          <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-gold-400/30 blur-2xl animate-pulse-slow" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-2.5 py-1 text-[10px] font-medium">
                <Sparkles className="w-3 h-3" />
                تقرير مساري
              </div>
              <div className="mt-2 font-bold text-base">عبدالله العتيبي</div>
              <div className="text-xs text-white/70">محلل بيانات</div>
            </div>
            <ScoreCircle value={78} />
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Skills row */}
          <div className="grid grid-cols-3 gap-2">
            <SkillStat label="حالية" value={12} tone="green" />
            <SkillStat label="جزئية" value={4} tone="amber" />
            <SkillStat label="فجوة" value={6} tone="red" />
          </div>

          {/* Learning path mini */}
          <div className="rounded-xl border border-stone-100 p-3 bg-stone-50/60">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-brand-600" />
              مسار التعلم المقترح
            </div>
            <div className="space-y-1.5">
              <PathRow step={1} title="أساسيات SQL والاستعلامات" weeks={3} done />
              <PathRow step={2} title="Power BI ولوحات المعلومات" weeks={4} active />
              <PathRow step={3} title="Python للتحليل المتقدم" weeks={6} />
            </div>
          </div>

          {/* Course chip */}
          <div className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-gold-50 to-white border border-gold-100 p-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-100 text-gold-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-stone-800 truncate">Google Data Analytics</div>
              <div className="text-[10px] text-stone-500">كورسيرا · 180 ساعة</div>
            </div>
            <div className="flex items-center gap-0.5 text-gold-500">
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating brand badge */}
      <div className="absolute -bottom-5 -right-5 hidden md:block">
        <div className="rounded-2xl bg-white shadow-xl border border-stone-100 px-4 py-3 flex items-center gap-2.5 animate-float">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-stone-500">تحليل ذكي</div>
            <div className="text-sm font-bold text-stone-900">Claude AI</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FloatingPill({ text, delay, tone }: { text: string; delay: number; tone: "brand" | "gold" }) {
  const cls =
    tone === "brand"
      ? "bg-white border-brand-100 text-brand-700"
      : "bg-white border-gold-200 text-gold-700";
  return (
    <div
      className={`pill ${cls} border shadow-md font-mono text-[11px] animate-float`}
      style={{ animationDelay: `${delay}s` }}
    >
      <Sparkles className="w-3 h-3" />
      {text}
    </div>
  );
}

function ScoreCircle({ value }: { value: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} className="stroke-white/20" strokeWidth="6" fill="none" />
        <circle
          cx="40"
          cy="40"
          r={r}
          className="stroke-gold-300"
          strokeWidth="6"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-base font-extrabold leading-none">{value}%</div>
        <div className="text-[9px] text-white/70 mt-0.5">تطابق</div>
      </div>
    </div>
  );
}

function SkillStat({ label, value, tone }: { label: string; value: number; tone: "green" | "amber" | "red" }) {
  const map = {
    green: "bg-green-50 text-green-700 border-green-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-red-50 text-red-700 border-red-100"
  } as const;
  return (
    <div className={`rounded-xl border p-2 text-center ${map[tone]}`}>
      <div className="text-lg font-extrabold leading-none">{value}</div>
      <div className="text-[10px] mt-1 opacity-80">{label}</div>
    </div>
  );
}

function PathRow({ step, title, weeks, done, active }: { step: number; title: string; weeks: number; done?: boolean; active?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
          done
            ? "bg-green-500 text-white"
            : active
            ? "bg-gradient-to-br from-brand-500 to-brand-700 text-white ring-4 ring-brand-100"
            : "bg-stone-200 text-stone-500"
        }`}
      >
        {done ? <CheckCircle2 className="w-3 h-3" /> : step}
      </div>
      <div className="flex-1 truncate text-stone-700">{title}</div>
      <span className="text-[10px] text-stone-400 shrink-0">{weeks}w</span>
    </div>
  );
}
