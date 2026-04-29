import { prisma } from "@/lib/prisma";
import { CoursesAdmin } from "./CoursesAdmin";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const [courses, platforms, skills] = await Promise.all([
    prisma.course.findMany({
      orderBy: { titleAr: "asc" },
      include: {
        platform: { select: { id: true, nameAr: true } },
        skills: { include: { skill: { select: { id: true, nameAr: true } } } }
      }
    }).catch(() => []),
    prisma.platform.findMany({ orderBy: { nameAr: "asc" } }).catch(() => []),
    prisma.skill.findMany({ orderBy: { nameAr: "asc" } }).catch(() => [])
  ]);

  const rows = courses.map((c) => ({
    id: c.id,
    titleAr: c.titleAr,
    titleEn: c.titleEn,
    description: c.description,
    url: c.url,
    durationHrs: c.durationHrs,
    level: c.level,
    isFree: c.isFree,
    language: c.language,
    platformId: c.platformId,
    platformName: c.platform?.nameAr ?? null,
    skillIds: c.skills.map((s) => s.skill.id),
    skillNames: c.skills.map((s) => s.skill.nameAr)
  }));

  return (
    <CoursesAdmin
      rows={rows}
      platforms={platforms.map((p) => ({ id: p.id, nameAr: p.nameAr }))}
      skills={skills.map((s) => ({ id: s.id, nameAr: s.nameAr }))}
    />
  );
}
