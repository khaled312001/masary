"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, AlertCircle, RefreshCw, Lightbulb } from "lucide-react";

const STEPS = [
  "مطابقة المسمى الوظيفي مع قاعدة البيانات",
  "تحليل فجوة المهارات وقراءة السيرة الذاتية",
  "رسم مسار التعلم وترشيح الكورسات والشركات",
  "صياغة التقرير النهائي"
];

const TIPS = [
  "ركّز على ٢-٣ مهارات مطلوبة بشدة في وظيفتك المستهدفة بدل تشتيت جهدك على الكثير.",
  "اربط كل مهارة تتعلّمها بمشروع صغير تطبّقه — التطبيق العملي يرسّخ التعلّم أكثر من المشاهدة.",
  "خصّص وقتاً أسبوعياً ثابتاً للتعلّم؛ التقدّم البطيء المستمر أقوى من الاندفاع المؤقت.",
  "اقرأ إعلانات الوظائف المستهدفة بعناية — الكلمات المتكررة فيها هي مهاراتك القادمة.",
  "الشهادات المعتمدة تفتح الأبواب، لكن المشاريع العملية هي ما يثبت قدرتك فعلياً.",
  "شبكة علاقاتك المهنية لا تقل أهمية عن مهاراتك؛ تواصل مع من يعملون في وظيفتك المستهدفة.",
  "حدّث سيرتك الذاتية بأحدث المهارات والدورات التي أتممتها — أصحاب العمل يقدّرون التطوّر المستمر."
];

export function PendingReport({ id }: { id: string }) {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);
  const [failed, setFailed] = useState<string | null>(null);
  const [tipIndex, setTipIndex] = useState(0);
  const startedRef = useRef(Date.now());

  // Rotate a fresh career tip every 5 seconds.
  useEffect(() => {
    const t = setInterval(() => setTipIndex((i) => (i + 1) % TIPS.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const tick = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedRef.current) / 1000));
    }, 1000);

    let stopped = false;
    async function poll() {
      try {
        const res = await fetch(`/api/reports/${id}`, { cache: "no-store" });
        if (!res.ok) return;
        const row = await res.json();
        const status = row?.data?.status;
        if (status === "error") {
          if (!stopped) setFailed(row?.data?.message || "تعذّر إنشاء التقرير.");
          return true;
        }
        if (status !== "pending") {
          // Report is ready — reload the server component to render it.
          if (!stopped) router.refresh();
          return true;
        }
      } catch {
        /* keep polling */
      }
      return false;
    }

    const interval = setInterval(async () => {
      const done = await poll();
      if (done) clearInterval(interval);
    }, 4000);

    return () => {
      stopped = true;
      clearInterval(tick);
      clearInterval(interval);
    };
  }, [id, router]);

  const activeStep = Math.min(STEPS.length - 1, Math.floor(elapsed / 18));

  if (failed) {
    return (
      <div className="card !p-8 md:!p-10 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-stone-900">تعذّر إنشاء التقرير</h1>
        <p className="mt-2 text-stone-600">{failed}</p>
        <Link href="/analyze" className="btn-primary mt-6 inline-flex">
          <RefreshCw className="w-4 h-4" />
          حاول مرة أخرى
        </Link>
      </div>
    );
  }

  return (
    <div className="card !p-8 md:!p-12 text-center space-y-6 max-w-xl mx-auto animate-fade-in">
      <div className="relative w-24 h-24 mx-auto">
        <div className="absolute inset-0 rounded-full border-4 border-brand-100" />
        <div className="absolute inset-0 rounded-full border-4 border-brand-600 border-t-transparent animate-spin" />
        <Brain className="absolute inset-0 m-auto w-10 h-10 text-brand-600 animate-pulse" />
      </div>
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-stone-900">
          يعمل الذكاء الاصطناعي على تقريرك...
        </h1>
        <p className="text-sm text-stone-600 mt-2">
          يستغرق التحليل عادةً من دقيقة إلى دقيقتين. تُحدَّث الصفحة تلقائياً عند الجهوز — يمكنك إبقاء
          الصفحة مفتوحة.
        </p>
        <p className="text-xs text-stone-400 mt-1">مضى {elapsed} ثانية</p>
      </div>
      <div className="flex flex-col gap-2.5 max-w-sm mx-auto text-right">
        {STEPS.map((text, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 text-sm transition ${
              i <= activeStep ? "text-brand-700 font-semibold" : "text-stone-400"
            }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                i < activeStep
                  ? "bg-brand-600"
                  : i === activeStep
                  ? "bg-brand-500 animate-pulse"
                  : "bg-stone-200"
              }`}
            />
            {text}
          </div>
        ))}
      </div>

      {/* Rotating career tips — a fresh card every 5 seconds */}
      <div className="pt-1">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-50 border border-gold-200 px-3 py-1 text-[11px] font-semibold text-gold-700">
            <Lightbulb className="w-3.5 h-3.5" />
            نصيحة أثناء الانتظار
          </span>
        </div>
        <div
          key={tipIndex}
          className="animate-slide-up rounded-2xl border border-brand-100 bg-brand-50/50 p-4 md:p-5 min-h-[84px] flex items-center justify-center"
        >
          <p className="text-sm md:text-[15px] leading-relaxed text-stone-700 max-w-md">
            {TIPS[tipIndex]}
          </p>
        </div>
        <div className="mt-3 flex items-center justify-center gap-1.5" aria-hidden="true">
          {TIPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === tipIndex ? "w-5 bg-brand-500" : "w-1.5 bg-stone-200"
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-[11px] text-stone-400">
        إن أرسلت بريدك الإلكتروني، سيصلك رابط التقرير فور جهوزه.
      </p>
    </div>
  );
}
