import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  ArrowLeft,
  Brain,
  BarChart3,
  Map,
  Sparkles,
  Target,
  GraduationCap,
  CheckCircle2,
  Building2
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/40 to-transparent pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-28 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-brand-100 px-4 py-1.5 text-xs font-medium text-brand-700 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              مدعوم بالذكاء الاصطناعي
            </div>
            <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight text-stone-900 text-balance leading-tight">
              مسارك المهني
              <br />
              يبدأ من <span className="bg-gradient-to-l from-brand-600 to-brand-800 bg-clip-text text-transparent">مساري</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-stone-600 text-balance">
              منصة ذكية تحلل الفجوة بين مهاراتك الحالية والمهارات المطلوبة لوظيفتك المستهدفة،
              وترسم لك مسار تعلم احترافي مخصص بدورات وروابط حقيقية.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/analyze" className="btn-primary text-base !py-3.5 !px-7">
                ابدأ التحليل الآن
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link href="#how" className="btn-secondary text-base !py-3.5 !px-7">
                كيف يعمل ؟
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { num: "+200", label: "مهارة محللة" },
                { num: "+50", label: "وظيفة مفهرسة" },
                { num: "+100", label: "كورس مقترح" },
                { num: "AI", label: "تحليل ذكي" }
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/80 border border-stone-100 p-4">
                  <div className="text-2xl md:text-3xl font-extrabold text-brand-700">{s.num}</div>
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
            ].map((f) => (
              <div key={f.title} className="card hover:shadow-md transition group">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition">
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
            <p className="mt-3 text-stone-600">3 خطوات بسيطة للحصول على تقريرك الكامل</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "أدخل بياناتك",
                desc: "اسمك، المسمى الوظيفي المستهدف، مهاراتك الحالية ودوراتك."
              },
              {
                step: "2",
                title: "تحليل بالذكاء الاصطناعي",
                desc: "يقوم المحرك بمقارنة بياناتك بقاعدة بيانات الوظائف والمهارات."
              },
              {
                step: "3",
                title: "احصل على تقريرك",
                desc: "تقرير مفصل بفجواتك ومسار التعلم والكورسات المقترحة."
              }
            ].map((s) => (
              <div key={s.step} className="relative card">
                <div className="absolute -top-4 right-6 w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-extrabold shadow-lg shadow-brand-600/30">
                  {s.step}
                </div>
                <h3 className="mt-4 text-lg font-bold text-stone-900">{s.title}</h3>
                <p className="mt-2 text-stone-600 text-sm leading-relaxed">{s.desc}</p>
                <CheckCircle2 className="mt-4 w-5 h-5 text-brand-500" />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/analyze" className="btn-primary text-base !py-3.5 !px-7">
              ابدأ تحليلك المجاني
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
