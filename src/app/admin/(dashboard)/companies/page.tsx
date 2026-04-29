import { CrudTable } from "@/components/admin/CrudTable";
import { apiServerSafe } from "@/lib/api";

export const dynamic = "force-dynamic";

type Company = { id: string; nameAr: string; nameEn: string | null; industry: string | null; website: string | null };

export default async function CompaniesPage() {
  const { data } = await apiServerSafe<Company[]>("/api/companies");
  const rows = data ?? [];
  return (
    <CrudTable
      title="الشركات وجهات العمل"
      endpoint="/api/proxy/api/companies"
      rows={rows}
      columns={[
        { key: "nameAr", label: "الاسم" },
        { key: "industry", label: "القطاع" },
        { key: "website", label: "الموقع", type: "url" }
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
