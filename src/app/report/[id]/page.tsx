import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { apiFetch } from "@/lib/api";
import type { AnalysisReport } from "@/types/report";
import { ReportView } from "./ReportView";
import { PendingReport } from "./PendingReport";

export const dynamic = "force-dynamic";

type ReportRow = {
  id: string;
  fullName: string;
  jobTitle: string;
  employer: string | null;
  createdAt: string;
  isPaid: boolean;
  data: AnalysisReport | { status: "pending" | "error"; message?: string };
};

export default async function ReportPage({ params }: { params: { id: string } }) {
  let report: ReportRow | null = null;
  try {
    report = await apiFetch<ReportRow>(`/api/reports/${params.id}`);
  } catch {
    notFound();
  }
  if (!report) notFound();

  const status = (report.data as { status?: string })?.status;
  const isPending = status === "pending" || status === "error";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 md:px-8 py-8 md:py-12">
        {isPending ? (
          <PendingReport id={report.id} />
        ) : (
          <ReportView
            report={{
              id: report.id,
              fullName: report.fullName,
              jobTitle: report.jobTitle,
              employer: report.employer,
              createdAt: report.createdAt,
              isPaid: !!report.isPaid,
              data: report.data as AnalysisReport
            }}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
