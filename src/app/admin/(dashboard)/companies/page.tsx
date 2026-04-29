import { prisma } from "@/lib/prisma";
import { CrudTable } from "@/components/admin/CrudTable";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const rows = await prisma.company.findMany({ orderBy: { nameAr: "asc" } }).catch(() => []);
  return (
    <CrudTable
      title="الشركات وجهات العمل"
      endpoint="/api/admin/companies"
      rows={rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
      columns={[
        { key: "nameAr", label: "الاسم" },
        { key: "industry", label: "القطاع" },
        {
          key: "website",
          label: "الموقع",
          render: (r) =>
            r.website ? (
              <a href={r.website} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">
                زيارة
              </a>
            ) : (
              "—"
            )
        }
      ]}
      fields={[
        { name: "nameAr", label: "الاسم بالعربية", required: true },
        { name: "nameEn", label: "الاسم بالإنجليزية" },
        { name: "industry", label: "القطاع", placeholder: "مثل: طاقة، بنوك، صناعة" },
        { name: "website", label: "الموقع الإلكتروني", type: "url" },
        { name: "logoUrl", label: "رابط الشعار", type: "url" },
        { name: "description", label: "وصف", type: "textarea" }
      ]}
    />
  );
}
