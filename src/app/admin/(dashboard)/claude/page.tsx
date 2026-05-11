import Link from "next/link";
import { apiServerSafe } from "@/lib/api";
import { AlertTriangle, Bot, Coins, Download, FileText, Gauge, Hash, Upload } from "lucide-react";

export const dynamic = "force-dynamic";

type ClaudeReport = {
  id: string;
  fullName: string;
  jobTitle: string;
  employer: string | null;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  claudeModel: string | null;
  createdAt: string;
};

type ClaudeStats = {
  summary: {
    totalReports: number;
    trackedReports: number;
    untrackedReports: number;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    averageInputTokens: number;
    averageOutputTokens: number;
    averageTotalTokens: number;
  };
  reports: ClaudeReport[];
};

export default async function ClaudeReportsPage() {
  const { data, error } = await apiServerSafe<ClaudeStats>("/api/stats/claude");
  const summary = data?.summary ?? {
    totalReports: 0,
    trackedReports: 0,
    untrackedReports: 0,
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    averageInputTokens: 0,
    averageOutputTokens: 0,
    averageTotalTokens: 0
  };
  const reports = data?.reports ?? [];

  const cards = [
    { label: "إجمالي التوكنز", value: summary.totalTokens, icon: Coins, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Input Tokens", value: summary.inputTokens, icon: Download, tone: "bg-blue-50 text-blue-700" },
    { label: "Output Tokens", value: summary.outputTokens, icon: Upload, tone: "bg-amber-50 text-amber-700" },
    { label: "متوسط العملية", value: summary.averageTotalTokens, icon: Gauge, tone: "bg-purple-50 text-purple-700" },
    { label: "عمليات محسوبة", value: summary.trackedReports, icon: Hash, tone: "bg-stone-100 text-stone-700" },
    { label: "غير محسوبة قديمة", value: summary.untrackedReports, icon: FileText, tone: "bg-red-50 text-red-700" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 flex items-center gap-2">
            <Bot className="w-7 h-7 text-brand-600" />
            تقارير Claude والتوكنز
          </h1>
          <p className="text-stone-600 mt-1">
            متابعة استخدام Claude لكل تقرير، مع إجماليات تتحدث تلقائياً من قاعدة البيانات
          </p>
        </div>
        <div className="text-xs text-stone-500">
          آخر تحديث عند فتح الصفحة: {new Date().toLocaleString("ar-SA")}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">تعذر تحميل بيانات Claude</div>
            <p className="text-sm opacity-80 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white border border-stone-100 p-4 md:p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.tone}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div className="mt-4 text-2xl md:text-3xl font-extrabold text-stone-900">
              {formatNumber(card.value)}
            </div>
            <div className="text-sm text-stone-600 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="p-4 md:p-5 border-b border-stone-100 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-stone-900">كل عمليات Claude</h2>
            <p className="text-xs text-stone-500 mt-1">
              التقارير القديمة قبل تسجيل التوكنز تظهر بدون أرقام دقيقة
            </p>
          </div>
          <div className="text-xs text-stone-500">
            {formatNumber(summary.totalReports)} تقرير
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-stone-600 text-xs">
              <tr>
                <th className="text-right p-3 font-semibold">العميل</th>
                <th className="text-right p-3 font-semibold">الوظيفة</th>
                <th className="text-right p-3 font-semibold">Input</th>
                <th className="text-right p-3 font-semibold">Output</th>
                <th className="text-right p-3 font-semibold">الإجمالي</th>
                <th className="text-right p-3 font-semibold">الموديل</th>
                <th className="text-right p-3 font-semibold">التاريخ</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-500">
                    لا توجد تقارير بعد
                  </td>
                </tr>
              )}
              {reports.map((report) => {
                const tracked = report.totalTokens > 0;
                return (
                  <tr key={report.id} className="border-t border-stone-100 hover:bg-stone-50">
                    <td className="p-3 font-semibold text-stone-900">{report.fullName}</td>
                    <td className="p-3 text-stone-700">
                      <div>{report.jobTitle}</div>
                      {report.employer && <div className="text-xs text-stone-400">{report.employer}</div>}
                    </td>
                    <td className="p-3 text-stone-700">{tracked ? formatNumber(report.inputTokens) : "—"}</td>
                    <td className="p-3 text-stone-700">{tracked ? formatNumber(report.outputTokens) : "—"}</td>
                    <td className="p-3 font-bold text-stone-900">{tracked ? formatNumber(report.totalTokens) : "غير محسوب"}</td>
                    <td className="p-3 text-xs text-stone-500">{report.claudeModel ?? "—"}</td>
                    <td className="p-3 text-xs text-stone-500 whitespace-nowrap">
                      {new Date(report.createdAt).toLocaleString("ar-SA")}
                    </td>
                    <td className="p-3 text-left">
                      <Link href={`/report/${report.id}`} target="_blank" className="text-xs text-brand-700 hover:underline">
                        عرض التقرير
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}
