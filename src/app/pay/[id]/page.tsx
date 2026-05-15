import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { apiFetch } from "@/lib/api";
import {
  Sparkles,
  Award,
  Printer,
  ArrowRight,
  CreditCard,
  CheckCircle2,
  Building2,
  MessageCircle,
  Shield
} from "lucide-react";
import { CopyButton } from "./CopyButton";

export const dynamic = "force-dynamic";

type ReportRow = {
  id: string;
  fullName: string;
  jobTitle: string;
  isPaid: boolean;
};

export default async function PayPage({ params }: { params: { id: string } }) {
  let report: ReportRow | null = null;
  try {
    report = await apiFetch<ReportRow>(`/api/reports/${params.id}`);
  } catch {
    notFound();
  }
  if (!report) notFound();

  const payment = {
    bank: process.env.NEXT_PUBLIC_PAY_BANK || "مصرف الراجحي",
    beneficiary: process.env.NEXT_PUBLIC_PAY_BENEFICIARY || "منصة مساري",
    iban: process.env.NEXT_PUBLIC_PAY_IBAN || "SA00 0000 0000 0000 0000 0000",
    amount: process.env.NEXT_PUBLIC_PAY_AMOUNT || "٥٠ ريال",
    whatsapp: (process.env.NEXT_PUBLIC_PAY_WHATSAPP || "966500000000").replace(/\D/g, ""),
    email: process.env.NEXT_PUBLIC_PAY_EMAIL || "admin@masary.sa"
  };

  // Already paid? redirect via component
  if (report.isPaid) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-2xl px-4 md:px-8 py-16 text-center">
          <div className="card !p-10">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="mt-4 text-2xl font-extrabold text-stone-900">التقرير مفعّل بالفعل</h1>
            <p className="mt-2 text-stone-600">يمكنك تنزيل التقرير وعرض شهادة التوصية</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href={`/report/${report.id}`} className="btn-primary">
                <ArrowRight className="w-4 h-4" />
                عرض التقرير
              </Link>
              <Link href={`/certificate/${report.id}`} className="btn-secondary">
                <Award className="w-4 h-4" />
                شهادة التوصية
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/30 to-transparent pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-gold-300/20 blur-3xl pointer-events-none animate-pulse-slow" />

        <div className="relative mx-auto max-w-3xl px-4 md:px-8 py-10 md:py-16">
          <div className="text-center mb-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-gold-50 border border-gold-200 px-3 py-1 text-xs font-medium text-gold-700">
              <Sparkles className="w-3.5 h-3.5" />
              تفعيل النسخة الكاملة
            </div>
            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-stone-900">
              فعّل التقرير وشهادة التوصية
            </h1>
            <p className="mt-3 text-stone-600">
              لـ <span className="font-bold text-stone-800">{report.fullName}</span> · {report.jobTitle}
            </p>
          </div>

          {/* Price card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 text-white p-6 md:p-10 shadow-2xl mb-6 animate-scale-in">
            <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-gold-400/20 blur-3xl pointer-events-none animate-pulse-slow" />
            <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-brand-300/20 blur-3xl pointer-events-none animate-pulse-slow" />
            <div className="relative grid sm:grid-cols-2 gap-6 items-center">
              <div>
                <div className="text-sm text-white/70 mb-1">الحزمة الكاملة</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl md:text-6xl font-extrabold">٥٠</span>
                  <span className="text-2xl font-bold">ريال</span>
                </div>
                <div className="text-xs text-white/60 mt-1">دفعة واحدة — لا اشتراك شهري</div>
              </div>
              <div className="space-y-2.5 text-sm">
                <Feat>
                  <Printer className="w-4 h-4 text-gold-300" />
                  تنزيل التقرير PDF
                </Feat>
                <Feat>
                  <Award className="w-4 h-4 text-gold-300" />
                  شهادة توصية معتمدة
                </Feat>
                <Feat>
                  <Shield className="w-4 h-4 text-gold-300" />
                  تفعيل دائم بدون تجديد
                </Feat>
              </div>
            </div>
          </div>

          {/* Payment instructions */}
          <div className="card !p-6 md:!p-8 space-y-5 animate-slide-up" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
            <div>
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-600" />
                خطوات الدفع
              </h2>
              <p className="text-stone-600 text-sm mt-1">
                حوّل المبلغ ثم أرسل إيصال التحويل لتفعيل تقريرك
              </p>
            </div>

            {/* Step 1: bank info */}
            <div className="rounded-2xl border border-stone-100 bg-stone-50/40 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 text-white flex items-center justify-center text-sm font-bold">1</span>
                <h3 className="font-bold text-stone-900">حوّل ٥٠ ريال إلى الحساب التالي</h3>
              </div>
              <div className="space-y-2 text-sm bg-white rounded-xl border border-stone-100 p-4">
                <Row label="اسم البنك" value={payment.bank} />
                <Row label="اسم المستفيد" value={payment.beneficiary} />
                <Row label="IBAN" value={payment.iban} mono copyable />
                <Row label="المبلغ" value={payment.amount} highlight />
                <Row label="رقم التقرير" value={report.id} mono small copyable />
              </div>
              <p className="text-[11px] text-stone-500 mt-3">
                💡 اذكر <strong>رقم التقرير</strong> في خانة الملاحظات عند التحويل
              </p>
            </div>

            {/* Step 2: send receipt */}
            <div className="rounded-2xl border border-stone-100 bg-stone-50/40 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 text-white flex items-center justify-center text-sm font-bold">2</span>
                <h3 className="font-bold text-stone-900">أرسل إيصال التحويل</h3>
              </div>
              <p className="text-sm text-stone-600 mb-3">
                بعد التحويل، أرسل صورة الإيصال + رقم التقرير عبر:
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/${payment.whatsapp}?text=${encodeURIComponent(`السلام عليكم، أرفقت إيصال التحويل لتفعيل التقرير رقم: ${report.id}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 hover:bg-green-600 text-white px-4 py-3 text-sm font-bold transition active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  واتساب
                </a>
                <a
                  href={`mailto:${payment.email}?subject=${encodeURIComponent(`تفعيل التقرير ${report.id}`)}&body=${encodeURIComponent(`السلام عليكم،\nأرفقت إيصال التحويل لتفعيل التقرير رقم: ${report.id}`)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 px-4 py-3 text-sm font-bold transition active:scale-95"
                >
                  <Building2 className="w-4 h-4" />
                  بريد إلكتروني
                </a>
              </div>
            </div>

            {/* Step 3: activation */}
            <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 text-white flex items-center justify-center text-sm font-bold">3</span>
                <h3 className="font-bold text-stone-900">سيتم تفعيل تقريرك</h3>
              </div>
              <p className="text-sm text-stone-600 mr-9">
                خلال 30 دقيقة من استلام الإيصال (أيام العمل) — وستحصل على رسالة تأكيد.
              </p>
            </div>

            <Link
              href={`/report/${report.id}`}
              className="inline-flex items-center justify-center gap-2 text-sm text-stone-500 hover:text-brand-700 transition"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للتقرير
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Feat({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="w-4 h-4 text-green-300 shrink-0" />
      <span className="flex items-center gap-2">{children}</span>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  highlight,
  small,
  copyable
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
  small?: boolean;
  copyable?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-stone-100 last:border-b-0 pb-1.5 last:pb-0">
      <span className="text-stone-500 text-xs">{label}</span>
      <div className="flex items-center gap-1.5 min-w-0">
        <span
          className={`${mono ? "font-mono" : "font-semibold"} ${highlight ? "text-brand-700 font-extrabold" : "text-stone-800"} ${small ? "text-[11px]" : "text-sm"} truncate`}
          title={value}
        >
          {value}
        </span>
        {copyable && <CopyButton value={value} label={`نسخ ${label}`} />}
      </div>
    </div>
  );
}
