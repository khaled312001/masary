import { CrudTable } from "@/components/admin/CrudTable";
import { apiServerSafe } from "@/lib/api";

export const dynamic = "force-dynamic";

type Platform = { id: string; nameAr: string; nameEn: string | null; website: string | null };

export default async function PlatformsPage() {
  const { data } = await apiServerSafe<Platform[]>("/api/platforms");
  const rows = data ?? [];
  return (
    <CrudTable
      title="منصات التعلم"
      endpoint="/api/proxy/api/platforms"
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
