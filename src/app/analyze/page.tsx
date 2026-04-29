import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnalyzeForm } from "./AnalyzeForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AnalyzePage() {
  const [jobs, companies] = await Promise.all([
    prisma.job.findMany({ select: { id: true, titleAr: true }, orderBy: { titleAr: "asc" } }).catch(() => []),
    prisma.company.findMany({ select: { id: true, nameAr: true }, orderBy: { nameAr: "asc" } }).catch(() => [])
  ]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 md:px-8 py-10 md:py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900">حلل مسارك المهني</h1>
          <p className="mt-2 text-stone-600">
            اكتب بياناتك وسنرسم لك خريطة مهاراتك ومسار تعلمك خلال ثوان
          </p>
        </div>
        <AnalyzeForm jobs={jobs} companies={companies} />
      </main>
      <Footer />
    </>
  );
}
