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
  ShieldCheck,
  Briefcase,
  UserCircle2,
  Users,
  Lightbulb,
  Zap
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* ───── Hero ───── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/40 to-transparent pointer-events-none" />
          <div className="absolute top-10 right-10 w-72 h-72 md:w-96 md:h-96 rounded-full bg-brand-300/20 blur-3xl pointer-events-none animate-pulse-slow" />
          <div className="absolute top-40 left-10 w-72 h-72 md:w-96 md:h-96 rounded-full bg-gold-300/20 blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
          <div className="absolute bottom-0 right-1/3 w-72 h-72 rounded-full bg-brand-400/15 blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: "3s" }} />
          <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-24">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
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
                <p className="mt-5 max-w-xl mx-auto lg:mx-0 text-base md:text-lg text-stone-600 text-balance leading-relaxed animate-slide-up" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
                  منصة ذكية تحلل الفجوة بين مهاراتك الحالية والمهارات المطلوبة لوظيفتك المستهدفة،
                  وترسم لك مسار تعلم احترافي مخصص بدورات وروابط حقيقية.
                </p>

                <div className="mt-7 flex flex-wrap justify-center lg:justify-start gap-3 animate-slide-up" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
                  <Link href="/analyze" className="btn-primary !py-3.5 !px-7 text-base">
                    <Sparkles className="w-4 h-4" />
                    ابدأ التحليل الآن
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                  <Link href="#how" className="btn-secondary !py-3.5 !px-6 text-base">
                    كيف يعمل؟
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-3 animate-fade-in" style={{ animationDelay: "400ms", animationFillMode: "backwards" }}>
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
                  className="group rounded-2xl bg-white/70 backdrop-blur border border-white/50 p-4 hover:shadow-lg hover:-translate-y-0.5 hover:border-brand-200 transition-all animate-slide-up text-center"
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

        {/* ───── Trusted Companies ───── */}
        <section id="companies" className="relative py-16 md:py-20 border-y border-stone-100 bg-white/40">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
                <Building2 className="w-3.5 h-3.5" />
                السوق المستهدف
              </div>
              <h2 className="mt-4 text-2xl md:text-4xl font-extrabold text-stone-900">
                مُصمَّم لكبرى الشركات السعودية
              </h2>
              <p className="mt-2 text-stone-600 max-w-xl mx-auto text-sm md:text-base">
                نُعدّك لوظائف حقيقية في أبرز الجهات الوطنية والقطاعات الاستراتيجية
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
              {[
                "أرامكو",
                "سابك",
                "معادن",
                "stc",
                "نيوم",
                "الراجحي",
                "البنك الأهلي",
                "PIF",
                "روشن",
                "السعودية",
                "مدن",
                "البحر الأحمر"
              ].map((name, i) => (
                <div
                  key={name}
                  className="group flex items-center justify-center h-16 rounded-2xl bg-white border border-stone-100 hover:border-brand-200 hover:shadow-md transition-all animate-fade-in"
                  style={{ animationDelay: `${i * 40}ms`, animationFillMode: "backwards" }}
                >
                  <span className="text-sm md:text-base font-bold text-stone-700 group-hover:text-brand-700 transition">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───── For Who? ───── */}
        <section id="audience" className="py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-gold-50 border border-gold-100 px-3 py-1 text-xs font-medium text-gold-700">
                <Users className="w-3.5 h-3.5" />
                لمن مساري
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-stone-900">ثلاث فئات نخدمها</h2>
              <p className="mt-3 text-stone-600 max-w-xl mx-auto">
                لكل فئة تحدياتها الخاصة، وحلولنا مصمّمة لتغطّي احتياجاتها
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: GraduationCap,
                  title: "الطلاب الجدد",
                  desc: "حدّد مهاراتك الناقصة قبل التخرّج، وارسم مسار تعلّم يجعلك جاهزاً لسوق العمل.",
                  color: "from-blue-500 to-indigo-600",
                  bg: "from-blue-50 to-indigo-50"
                },
                {
                  icon: Briefcase,
                  title: "الباحثون عن عمل",
                  desc: "افهم تماماً ما تحتاجه الوظيفة المستهدفة، وأكمل فجوات مهاراتك بكورسات منتقاة.",
                  color: "from-emerald-500 to-brand-600",
                  bg: "from-emerald-50 to-brand-50"
                },
                {
                  icon: UserCircle2,
                  title: "الموظفون الجدد",
                  desc: "تكيّف بسرعة مع متطلبات وظيفتك الجديدة وطوّر نفسك للتقدّم في المسار المهني.",
                  color: "from-amber-500 to-gold-600",
                  bg: "from-amber-50 to-gold-50"
                }
              ].map((p, i) => (
                <div
                  key={p.title}
                  className="group relative rounded-3xl bg-white border border-stone-100 p-6 md:p-7 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms`, animationFillMode: "backwards" }}
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-l ${p.color}`} />
                  <div className={`absolute -left-12 -bottom-12 w-32 h-32 rounded-full bg-gradient-to-br ${p.bg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <p.icon className="w-7 h-7" />
                    </div>
                    <h3 className="mt-5 text-lg md:text-xl font-extrabold text-stone-900">{p.title}</h3>
                    <p className="mt-2 text-stone-600 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───── How it works ───── */}
        <section id="how" className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/30 via-white to-white" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-200/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gold-200/20 blur-3xl pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 md:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-brand-100 px-3 py-1 text-xs font-medium text-brand-700 shadow-sm">
                <Zap className="w-3.5 h-3.5" />
                3 خطوات فقط
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-stone-900">كيف يعمل مساري؟</h2>
              <p className="mt-3 text-stone-600 max-w-xl mx-auto">
                من إدخال البيانات إلى تقرير شامل خلال أقل من دقيقة
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-12 right-[16%] left-[16%] h-px bg-gradient-to-l from-brand-300 via-gold-300 to-brand-300" aria-hidden />

              {[
                {
                  step: "1",
                  icon: UserCircle2,
                  title: "إدخال البيانات",
                  desc: "الاسم، المسمى الوظيفي المستهدف، المهارات الحالية والدورات السابقة."
                },
                {
                  step: "2",
                  icon: Brain,
                  title: "تحليل بالذكاء الاصطناعي",
                  desc: "محرك Claude AI يقارن البيانات بقاعدة الوظائف والمهارات المنتقاة."
                },
                {
                  step: "3",
                  icon: BarChart3,
                  title: "إصدار التقرير",
                  desc: "تقرير مفصل بالفجوات ومسار تعلم وكورسات حقيقية بروابطها."
                }
              ].map((s, i) => (
                <div
                  key={s.step}
                  className="relative group animate-slide-up"
                  style={{ animationDelay: `${i * 120}ms`, animationFillMode: "backwards" }}
                >
                  <div className="bg-white rounded-3xl border border-stone-100 p-6 md:p-7 hover:shadow-xl hover:-translate-y-1 transition-all">
                    <div className="relative w-24 h-24 mx-auto">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-100 to-gold-100 group-hover:from-brand-200 group-hover:to-gold-200 transition-colors" />
                      <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center shadow-inner">
                        <s.icon className="w-9 h-9 text-brand-700" />
                      </div>
                      <div className="absolute -bottom-1 -left-1 w-9 h-9 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 text-white flex items-center justify-center font-extrabold text-sm shadow-lg shadow-brand-600/30">
                        {s.step}
                      </div>
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-stone-900 text-center">{s.title}</h3>
                    <p className="mt-2 text-stone-600 text-sm leading-relaxed text-center">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───── Features ───── */}
        <section id="features" className="py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
                <Lightbulb className="w-3.5 h-3.5" />
                ميزات المنصة
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-stone-900">لماذا مساري؟</h2>
              <p className="mt-3 text-stone-600 max-w-xl mx-auto">
                تجربة مخصصة بنبرة محفزة لسوق العمل السعودي والخليجي
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Brain, title: "تحليل ذكي", desc: "محرك يقارن مهاراتك بمتطلبات الوظيفة بدقة عالية ويحدد فجواتك بوضوح." },
                { icon: Map, title: "مسار تعلم مخصص", desc: "خطة مرتبة من الأساسيات إلى المتقدم لتصل لوظيفتك المستهدفة." },
                { icon: GraduationCap, title: "كورسات بروابط حقيقية", desc: "مكتبة منتقاة من المنصات المعتمدة كإدراك ورواق وأكاديمية طويق." },
                { icon: BarChart3, title: "تقرير احترافي", desc: "تقرير بصري مفصل بنسبة التطابق وقائمة المهارات وقابل للطباعة." },
                { icon: Building2, title: "جهات عمل خليجية", desc: "اقتراحات لجهات حقيقية كأرامكو ومعادن والراجحي والمدن الصناعية." },
                { icon: Target, title: "خطوات قابلة للتنفيذ", desc: "نخرجك بخطوات واضحة قابلة للتطبيق فوراً بدلاً من نصائح عامة." }
              ].map((f, i) => (
                <div
                  key={f.title}
                  className="group relative rounded-2xl bg-white border border-stone-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${i * 70}ms`, animationFillMode: "backwards" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-brand-50/0 group-hover:to-brand-50/50 transition-colors" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-brand-500 group-hover:to-brand-700 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <f.icon className="w-6 h-6" />
                    </div>
                    <h3 className="mt-4 text-base md:text-lg font-bold text-stone-900">{f.title}</h3>
                    <p className="mt-2 text-stone-600 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───── Final CTA ───── */}
        <section className="mx-auto max-w-5xl px-4 md:px-8 py-16 md:py-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 text-white p-8 md:p-14 shadow-2xl">
            <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-gold-400/20 blur-3xl pointer-events-none animate-pulse-slow" />
            <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-brand-300/20 blur-3xl pointer-events-none animate-pulse-slow" />
            <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />

            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Sparkles className="w-12 h-12 text-gold-300" />
                <h3 className="mt-4 text-2xl md:text-3xl font-extrabold">جاهز لتحليل مسارك؟</h3>
                <p className="mt-3 text-white/80 max-w-md">
                  املأ بياناتك واحصل على تقرير ذكي مفصّل بمسار تعلم مخصّص خلال أقل من دقيقة.
                </p>
              </div>
              <div className="md:text-left flex flex-col gap-3 md:items-start">
                <Link
                  href="/analyze"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-brand-800 hover:bg-gold-50 px-6 py-3.5 font-bold shadow-lg shadow-black/10 transition hover:scale-105 active:scale-95 w-full md:w-auto"
                >
                  <Sparkles className="w-4 h-4" />
                  ابدأ التحليل الآن
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <Link
                  href="/admin/login"
                  className="inline-flex items-center justify-center gap-2 text-xs text-white/70 hover:text-white transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  دخول الإدارة
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
