import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroVisual } from "@/components/HeroVisual";
import {
  ArrowLeft,
  Brain,
  BarChart3,
  Map,
  Sparkles,
  Target,
  GraduationCap,
  CheckCircle2,
  Building2,
  ShieldCheck
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/40 to-transparent pointer-events-none" />
          <div className="absolute top-10 right-10 w-72 h-72 md:w-96 md:h-96 rounded-full bg-brand-300/20 blur-3xl pointer-events-none animate-pulse-slow" />
          <div className="absolute top-40 left-10 w-72 h-72 md:w-96 md:h-96 rounded-full bg-gold-300/20 blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
          <div className="absolute bottom-0 right-1/3 w-72 h-72 rounded-full bg-brand-400/15 blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: "3s" }} />
          <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-24">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              {/* Text column */}
              <div className="text-center lg:text-right order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur border border-brand-100 px-4 py-1.5 text-xs font-medium text-brand-700 shadow-sm animate-fade-in">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex w-full h-full rounded-full bg-brand-500 opacity-75 animate-ping" />
                    <span className="relative inline-flex w-2 h-2 rounded-full bg-brand-600" />
                  </span>
                  مدعوم بالذكاء الاصطناعي · Claude AI
                </div>
                <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-stone-900 text-balance leading-[1.1] animate-slide-up">
                  مسارك المهني
                  <br />
                  يبدأ من{" "}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-l from-brand-500 via-brand-700 to-brand-900 bg-clip-text text-transparent">
                      مساري
                    </span>
                    <span className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-l from-gold-300/80 to-gold-500/80 -z-10 rounded-full" />
                  </span>
                </h1>
                <p
                  className="mt-5 max-w-xl mx-auto lg:mx-0 text-base md:text-lg text-stone-600 text-balance leading-relaxed animate-slide-up"
                  style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
                >
                  منصة ذكية تحلل الفجوة بين مهاراتك الحالية والمهارات المطلوبة لوظيفتك المستهدفة،
                  وترسم لك مسار تعلم احترافي مخصص بدورات وروابط حقيقية.
                </p>

                {/* CTA buttons */}
                <div
                  className="mt-7 flex flex-wrap justify-center lg:justify-start gap-3 animate-slide-up"
                  style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
                >
                  <Link href="/admin/login" className="btn-primary !py-3.5 !px-6 text-base">
                    <Sparkles className="w-4 h-4" />
                    دخول الإدارة
                  </Link>
                  <Link href="#how" className="btn-secondary !py-3.5 !px-6 text-base">
                    كيف يعمل؟
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>

                {/* Trust signals */}
                <div
                  className="mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-3 animate-fade-in"
                  style={{ animationDelay: "400ms", animationFillMode: "backwards" }}
                >
                  <div className="flex items-center gap-1.5 text-xs text-stone-600">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    تحليل دقيق
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-600">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    مسار مخصص
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-600">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    سوق سعودي وخليجي
                  </div>
                </div>
              </div>

              {/* Visual column */}
              <div className="order-1 lg:order-2 animate-slide-up" style={{ animationDelay: "150ms", animationFillMode: "backwards" }}>
                <HeroVisual />
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto">
              {[
                { num: "+200", label: "مهارة محللة" },
                { num: "+50", label: "وظيفة مفهرسة" },
                { num: "+100", label: "كورس مقترح" },
                { num: "AI", label: "تحليل ذكي" }
              ].map((s, i) => (
                <div
                  key={s.label}
                  className="group rounded-2xl bg-white/70 backdrop-blur border border-white/50 p-4 hover:shadow-lg hover:-translate-y-0.5 hover:border-brand-200 transition-all animate-slide-up"
                  style={{ animationDelay: `${300 + i * 100}ms`, animationFillMode: "backwards" }}
                >
                  <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-l from-brand-600 to-brand-800 bg-clip-text text-transparent">
                    {s.num}
                  </div>
                  <div className="text-xs text-stone-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-7xl px-4 md:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900">لماذا مساري؟</h2>
            <p className="mt-3 text-stone-600">تجربة مخصصة بنبرة محفزة لسوق العمل السعودي والخليجي</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "تحليل ذكي بالذكاء الاصطناعي",
                desc: "محرك تحليل متقدم يقارن مهاراتك بمتطلبات الوظيفة ويحدد الفجوات بدقة."
              },
              {
                icon: Map,
                title: "مسار تعلم مخصص",
                desc: "خطة عملية مرتبة من الأساسيات إلى المتقدم لتصل لوظيفتك المستهدفة."
              },
              {
                icon: GraduationCap,
                title: "كورسات حقيقية بروابط",
                desc: "مكتبة منتقاة من الكورسات والمنصات المعتمدة بروابط مباشرة للتسجيل."
              },
              {
                icon: BarChart3,
                title: "تقرير احترافي قابل للطباعة",
                desc: "تقرير بصري مفصل بنسبة التطابق وقائمة المهارات الناقصة والمتوفرة."
              },
              {
                icon: Building2,
                title: "جهات عمل سعودية وخليجية",
                desc: "اقتراحات لجهات عمل واقعية كأرامكو ومعادن والراجحي والمدن الصناعية."
              },
              {
                icon: Target,
                title: "تركيز على نتيجة قابلة للتنفيذ",
                desc: "نخرجك بخطوات واضحة قابلة للتطبيق فورا بدلا من نصائح عامة."
              }
            ].map((f, i) => (
              <div
                key={f.title}
                className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-brand-500 group-hover:to-brand-700 group-hover:text-white group-hover:scale-110 transition-all">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-stone-900">{f.title}</h3>
                <p className="mt-2 text-stone-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mx-auto max-w-7xl px-4 md:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900">كيف يعمل مساري؟</h2>
            <p className="mt-3 text-stone-600">3 خطوات بسيطة للحصول على تقرير كامل</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "إدخال البيانات", desc: "الاسم، المسمى الوظيفي المستهدف، المهارات الحالية والدورات." },
              { step: "2", title: "تحليل بالذكاء الاصطناعي", desc: "يقوم المحرك بمقارنة البيانات بقاعدة بيانات الوظائف والمهارات." },
              { step: "3", title: "إصدار التقرير", desc: "تقرير مفصل بالفجوات ومسار التعلم والكورسات المقترحة." }
            ].map((s, i) => (
              <div
                key={s.step}
                className="relative card group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: "backwards" }}
              >
                <div className="absolute -top-4 right-6 w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-extrabold shadow-lg shadow-brand-600/30 group-hover:scale-110 transition-transform">
                  {s.step}
                </div>
                <h3 className="mt-4 text-lg font-bold text-stone-900">{s.title}</h3>
                <p className="mt-2 text-stone-600 text-sm leading-relaxed">{s.desc}</p>
                <CheckCircle2 className="mt-4 w-5 h-5 text-brand-500" />
              </div>
            ))}
          </div>
        </section>

        {/* Admin only notice */}
        <section className="mx-auto max-w-4xl px-4 md:px-8 py-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 text-white p-8 md:p-12 text-center shadow-2xl">
            <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-gold-400/20 blur-3xl pointer-events-none animate-pulse-slow" />
            <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-brand-300/20 blur-3xl pointer-events-none animate-pulse-slow" />
            <div className="relative">
              <ShieldCheck className="w-12 h-12 mx-auto text-gold-300" />
              <h3 className="mt-4 text-2xl md:text-3xl font-extrabold">منصة بدخول مُدار</h3>
              <p className="mt-3 text-white/80 max-w-xl mx-auto">
                التقارير تُصدَر فقط من قِبل المشرفين المعتمدين لضمان الجودة والدقة.
                إذا كنت مشرفاً، ادخل لوحة التحكم لإصدار تقرير جديد.
              </p>
              <Link
                href="/admin/login"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white text-brand-800 hover:bg-gold-50 px-6 py-3 font-bold shadow-lg shadow-black/10 transition hover:scale-105 active:scale-95"
              >
                دخول لوحة التحكم
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
