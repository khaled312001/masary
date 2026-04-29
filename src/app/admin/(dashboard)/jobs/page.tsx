import { prisma } from "@/lib/prisma";
import { JobsAdmin } from "./JobsAdmin";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const [jobs, skills] = await Promise.all([
    prisma.job.findMany({
      orderBy: { titleAr: "asc" },
      include: { skills: { include: { skill: { select: { id: true, nameAr: true } } } } }
    }).catch(() => []),
    prisma.skill.findMany({ orderBy: { nameAr: "asc" } }).catch(() => [])
  ]);

  const rows = jobs.map((j) => ({
    id: j.id,
    titleAr: j.titleAr,
    titleEn: j.titleEn,
    descriptionAr: j.descriptionAr,
    category: j.category,
    level: j.level,
    skills: j.skills.map((js) => ({
      skillId: js.skillId,
      nameAr: js.skill.nameAr,
      importance: js.importance
    }))
  }));

  return <JobsAdmin rows={rows} skills={skills.map((s) => ({ id: s.id, nameAr: s.nameAr }))} />;
}
