import { prisma } from "@/lib/prisma";
import { CrudTable } from "@/components/admin/CrudTable";

export const dynamic = "force-dynamic";

export default async function PlatformsPage() {
  const rows = await prisma.platform.findMany({ orderBy: { nameAr: "asc" } }).catch(() => []);
  return (
    <CrudTable
      title="منصات التعلم"
      endpoint="/api/admin/platforms"
      rows={rows}
      columns={[
        { key: "nameAr", label: "الاسم" },
        { key: "nameEn", label: "بالإنجليزية" },
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
        { name: "website", label: "الموقع الإلكتروني", type: "url" },
        { name: "logoUrl", label: "رابط الشعار", type: "url" }
      ]}
    />
  );
}
