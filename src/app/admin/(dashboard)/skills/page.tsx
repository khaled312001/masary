import { CrudTable } from "@/components/admin/CrudTable";
import { apiServerSafe } from "@/lib/api";

export const dynamic = "force-dynamic";

type Skill = { id: string; nameAr: string; nameEn: string | null; category: string | null };

export default async function SkillsPage() {
  const { data } = await apiServerSafe<Skill[]>("/api/skills");
  const rows = (data ?? []).map((r) => ({ ...r }));
  return (
    <CrudTable
      title="المهارات"
      endpoint="/api/proxy/api/skills"
      rows={rows}
      columns={[
        { key: "nameAr", label: "الاسم بالعربية" },
        { key: "nameEn", label: "الاسم بالإنجليزية" },
        { key: "category", label: "التصنيف" }
      ]}
      fields={[
        { name: "nameAr", label: "الاسم بالعربية", required: true },
        { name: "nameEn", label: "الاسم بالإنجليزية" },
        { name: "category", label: "التصنيف", placeholder: "مثل: تقني، إداري، تحليلي" }
      ]}
    />
  );
}
