import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReportsAdminPage() {
  const reports = await prisma.report
    .findMany({ orderBy: { createdAt: "desc" }, take: 200 })
    .catch(() => []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900">التقارير المُولّدة</h1>
        <p className="text-stone-600 mt-1">آخر التقارير التي أنشأها المستخدمون عبر المنصة</p>
      </div>
      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-stone-600 text-xs">
              <tr>
                <th className="text-right p-3 font-semibold">الاسم</th>
                <th className="text-right p-3 font-semibold">المسمى</th>
                <th className="text-right p-3 font-semibold">جهة العمل</th>
                <th className="text-right p-3 font-semibold">التاريخ</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-500">
                    لم يتم إنشاء تقارير بعد
                  </td>
                </tr>
              )}
              {reports.map((r) => (
                <tr key={r.id} className="border-t border-stone-100 hover:bg-stone-50">
                  <td className="p-3 font-semibold text-stone-900">{r.fullName}</td>
                  <td className="p-3 text-stone-700">{r.jobTitle}</td>
                  <td className="p-3 text-stone-700">{r.employer ?? "—"}</td>
                  <td className="p-3 text-stone-500 text-xs">
                    {new Date(r.createdAt).toLocaleString("ar-SA")}
                  </td>
                  <td className="p-3 text-left">
                    <Link
                      href={`/report/${r.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-brand-700 hover:underline text-xs"
                    >
                      عرض <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
