import { prisma } from "@/lib/prisma";
import { CrudTable } from "@/components/admin/CrudTable";

export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const rows = await prisma.skill.findMany({ orderBy: { nameAr: "asc" } }).catch(() => []);
  return (
    <CrudTable
      title="المهارات"
      endpoint="/api/admin/skills"
      rows={rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
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
