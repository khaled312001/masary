import { notFound } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type { AnalysisReport } from "@/types/report";
import { Award, Sparkles, Lock, ArrowRight } from "lucide-react";
import { PrintBtnClient } from "./PrintBtnClient";

export const dynamic = "force-dynamic";

type ReportRow = {
  id: string;
  fullName: string;
  jobTitle: string;
  employer: string | null;
  createdAt: string;
  isPaid: boolean;
  data: AnalysisReport;
};

export default async function CertificatePage({ params }: { params: { id: string } }) {
  let report: ReportRow | null = null;
  try {
    report = await apiFetch<ReportRow>(`/api/reports/${params.id}`);
  } catch {
    notFound();
  }
  if (!report) notFound();

  if (!report.isPaid) {
    return (
      <main className="min-h-screen bg-mesh flex items-center justify-center px-4 py-10">
        <div className="card !p-10 text-center max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-gold-50 flex items-center justify-center">
            <Lock className="w-8 h-8 text-gold-600" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-stone-900">شهادة التوصية مقفلة</h1>
          <p className="mt-2 text-stone-600">
            فعّل النسخة الكاملة (٥٠ ريال) لتنزيل الشهادة الخاصة بك
          </p>
          <Link href={`/pay/${report.id}`} className="btn-primary mt-6 w-full">
            <Sparkles className="w-4 h-4" />
            فعّل الآن
          </Link>
          <Link
            href={`/report/${report.id}`}
            className="mt-3 inline-flex items-center justify-center gap-2 text-sm text-stone-500 hover:text-brand-700 transition w-full"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للتقرير
          </Link>
        </div>
      </main>
    );
  }

  const date = new Date(report.createdAt).toLocaleDateString("ar-SA-u-nu-arab", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const certNumber = `MSY-${report.id.slice(-8).toUpperCase()}`;

  return (
    <main className="min-h-screen bg-mesh py-6 md:py-12 px-4 print:bg-white print:py-0 print:px-0">
      {/* Print button — visible only on screen */}
      <div className="max-w-3xl mx-auto mb-4 flex justify-center gap-2 no-print">
        <PrintBtnClient />
        <Link
          href={`/report/${report.id}`}
          className="inline-flex items-center gap-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 px-4 py-2 text-sm font-semibold text-stone-700 transition"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للتقرير
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="relative aspect-[1/1.41] bg-white rounded-3xl shadow-2xl border-[12px] border-double border-brand-700 p-8 md:p-14 overflow-hidden print:shadow-none print:rounded-none">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-gold-500/40 rounded-tl-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-gold-500/40 rounded-tr-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-gold-500/40 rounded-bl-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-gold-500/40 rounded-br-3xl pointer-events-none" />

          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
            <Award className="w-[400px] h-[400px] text-brand-900" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col items-center text-center">
            {/* Header logo */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-900 flex items-center justify-center text-white shadow-md">
                <span className="text-2xl font-extrabold">M</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-brand-800">مساري</div>
                <div className="text-xs text-stone-500">masary</div>
              </div>
            </div>

            <div className="mt-4 mb-2 flex items-center gap-2 text-gold-600">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-widest uppercase">Certificate of Recommendation</span>
              <Sparkles className="w-4 h-4" />
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-stone-900">
              شهادة توصية
            </h1>
            <div className="mt-1 text-base text-stone-500">منصة مساري لتحليل المسار المهني</div>

            <div className="my-6 md:my-10 w-32 h-px bg-gradient-to-l from-transparent via-gold-400 to-transparent" />

            <p className="text-sm md:text-base text-stone-600">تشهد منصة مساري بأن</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold bg-gradient-to-l from-brand-700 to-brand-900 bg-clip-text text-transparent leading-tight">
              {report.fullName}
            </h2>
            <p className="mt-4 text-sm md:text-base text-stone-700 max-w-xl leading-relaxed">
              قد أتمّ بنجاح تحليل مساره المهني المتعلق بوظيفة
              <span className="font-bold text-brand-800"> «{report.jobTitle}» </span>
              {report.employer && (
                <>
                  بهدف الانضمام لـ<span className="font-bold text-brand-800"> «{report.employer}» </span>
                </>
              )}
              وحصل على نسبة تطابق
              <span className="font-extrabold text-gold-700 mx-1">
                {report.data.matchScore}%
              </span>
              مع متطلبات الوظيفة، ورُسم له مسار تعلم مخصّص لتطوير مهاراته.
            </p>

            <div className="my-6 md:my-8 grid grid-cols-3 gap-3 w-full max-w-md text-center">
              <Stat value={report.data.presentSkills?.length ?? 0} label="مهارات حالية" />
              <Stat value={report.data.missingSkills?.length ?? 0} label="مهارات مستهدفة" />
              <Stat value={report.data.learningPath?.length ?? 0} label="خطوات تعلم" />
            </div>

            {/* Footer / signature */}
            <div className="mt-auto w-full grid grid-cols-2 gap-4 pt-6">
              <div className="text-center">
                <div className="text-xs text-stone-500 mb-1">تاريخ الإصدار</div>
                <div className="text-sm font-bold text-stone-800">{date}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-stone-500 mb-1">رقم الشهادة</div>
                <div className="text-sm font-mono font-bold text-stone-800">{certNumber}</div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-stone-400 text-xs">
              <span>للتحقق:</span>
              <span className="font-mono">masary-five.vercel.app/certificate/{report.id.slice(-8)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl bg-stone-50 border border-stone-100 p-3">
      <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-l from-brand-700 to-brand-900 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-[10px] md:text-xs text-stone-500 mt-1">{label}</div>
    </div>
  );
}

