import Link from "next/link";
import { Logo } from "./Logo";
import { Sparkles, Mail, ArrowLeft } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 no-print bg-gradient-to-b from-transparent to-brand-50/30">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-12 gap-8 md:gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <Logo size={44} />
            <p className="mt-4 text-stone-600 text-sm leading-relaxed max-w-md">
              منصة عربية ذكية لتحليل الفجوة بين مهاراتك الحالية ومتطلبات وظيفتك المستهدفة،
              ورسم مسار تعلم احترافي مدعوم بالذكاء الاصطناعي ومناسب لسوق العمل السعودي والخليجي.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border border-brand-100 px-3 py-1.5 text-xs font-medium text-brand-700 shadow-sm">
              <Sparkles className="w-3 h-3" />
              مدعوم بـ Claude AI
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3">
            <h4 className="font-bold text-stone-900 mb-3 text-sm">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#how" className="text-stone-600 hover:text-brand-700 transition">
                  كيف يعمل
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-stone-600 hover:text-brand-700 transition">
                  الميزات
                </Link>
              </li>
              <li>
                <Link href="/#audience" className="text-stone-600 hover:text-brand-700 transition">
                  لمن مساري
                </Link>
              </li>
              <li>
                <Link href="/#companies" className="text-stone-600 hover:text-brand-700 transition">
                  الشركات
                </Link>
              </li>
            </ul>
          </div>

          {/* Get started / contact */}
          <div className="md:col-span-4">
            <h4 className="font-bold text-stone-900 mb-3 text-sm">ابدأ الآن</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/analyze"
                  className="inline-flex items-center gap-2 text-brand-700 hover:text-brand-900 font-semibold transition"
                >
                  <Sparkles className="w-4 h-4" />
                  ابدأ التحليل المجاني
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <a
                  href="mailto:admin@masary.sa"
                  className="inline-flex items-center gap-2 text-stone-600 hover:text-brand-700 transition"
                >
                  <Mail className="w-4 h-4" />
                  admin@masary.sa
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-200/70 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-stone-500">
          <div>© {year} مساري — جميع الحقوق محفوظة.</div>
          <div className="flex items-center gap-1.5">
            <span>صُمّم خصيصاً لسوق العمل</span>
            <span className="font-bold text-brand-700">السعودي والخليجي</span>
            <span>🇸🇦</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
