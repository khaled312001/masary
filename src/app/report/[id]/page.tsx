import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import type { AnalysisReport } from "@/lib/ai";
import { ReportView } from "./ReportView";

export const dynamic = "force-dynamic";

export default async function ReportPage({ params }: { params: { id: string } }) {
  const report = await prisma.report.findUnique({ where: { id: params.id } }).catch(() => null);
  if (!report) notFound();

  const data = report.data as unknown as AnalysisReport;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 md:px-8 py-8 md:py-12">
        <ReportView
          report={{
            id: report.id,
            fullName: report.fullName,
            jobTitle: report.jobTitle,
            employer: report.employer,
            createdAt: report.createdAt.toISOString(),
            data
          }}
        />
      </main>
      <Footer />
    </>
  );
}
