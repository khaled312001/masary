import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { apiFetch } from "@/lib/api";
import { AnalyzeForm } from "./AnalyzeForm";
import { Sparkles, ShieldCheck, Clock, Lightbulb } from "lucide-react";

export const dynamic = "force-dynamic";

type Job = { id: string; titleAr: string };
type Company = { id: string; nameAr: string };
type Skill = { id: string; nameAr: string };

async function fetchOptions() {
  try {
    const [jobs, companies, skills] = await Promise.all([
      apiFetch<Job[]>("/api/jobs").catch(() => []),
      apiFetch<Company[]>("/api/companies").catch(() => []),
      apiFetch<Skill[]>("/api/skills").catch(() => [])
    ]);
    return {
      jobs: (jobs ?? []).map((j) => ({ id: j.id, titleAr: j.titleAr })),
      companies: (companies ?? []).map((c) => ({ id: c.id, nameAr: c.nameAr })),
      skills: (skills ?? []).map((s) => ({ id: s.id, nameAr: s.nameAr }))
    };
  } catch {
    return { jobs: [], companies: [], skills: [] };
  }
}

export default async function PublicAnalyzePage() {
  const { jobs, companies, skills } = await fetchOptions();

  return (
    <>
      <Header />
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/40 to-transparent pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-brand-300/20 blur-3xl pointer-events-none animate-pulse-slow" />
        <div className="absolute top-40 left-10 w-72 h-72 rounded-full bg-gold-300/20 blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: "1.5s" }} />

        <div className="relative mx-auto max-w-4xl px-4 md:px-8 py-10 md:py-16">
          <div className="text-center mb-10 animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur border border-brand-100 px-4 py-1.5 text-xs font-medium text-brand-700 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              تحليل ذكي بالذكاء الاصطناعي
            </div>
            <h1 className="mt-5 text-3xl md:text-5xl font-extrabold tracking-tight text-stone-900 text-balance leading-tight">
              ابدأ تحليل{" "}
              <span className="bg-gradient-to-l from-brand-600 to-brand-900 bg-clip-text text-transparent">
                مسارك المهني
              </span>
            </h1>
            <p className="mt-4 text-stone-600 text-base md:text-lg max-w-xl mx-auto">
              املأ بياناتك أدناه وسنُصدر لك تقريراً مفصلاً خلال أقل من دقيقة
            </p>
          </div>

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "150ms", animationFillMode: "backwards" }}>
            <Pillar icon={Clock} title="أقل من دقيقة" desc="استلم تقريرك سريعاً" />
            <Pillar icon={ShieldCheck} title="بياناتك آمنة" desc="خصوصية كاملة" />
            <Pillar icon={Lightbulb} title="نتائج عملية" desc="خطوات قابلة للتنفيذ" />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
            <AnalyzeForm jobs={jobs} companies={companies} skills={skills} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Pillar({
  icon: Icon,
  title,
  desc
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur border border-stone-100 p-3 md:p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="w-9 h-9 mx-auto rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
        <Icon className="w-4 h-4 md:w-5 md:h-5" />
      </div>
      <div className="text-xs md:text-sm font-bold text-stone-900 mt-2">{title}</div>
      <div className="text-[10px] md:text-xs text-stone-500 mt-0.5">{desc}</div>
    </div>
  );
}
