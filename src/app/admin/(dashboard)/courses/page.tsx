import { CoursesAdmin } from "./CoursesAdmin";
import { apiServerSafe } from "@/lib/api";

export const dynamic = "force-dynamic";

type Course = {
  id: string;
  titleAr: string;
  titleEn: string | null;
  description: string | null;
  url: string | null;
  durationHrs: number | null;
  level: string | null;
  isFree: boolean;
  language: string | null;
  platformId: string | null;
  platformName: string | null;
  skillIds: string[];
  skillNames: string[];
};
type Platform = { id: string; nameAr: string };
type Skill = { id: string; nameAr: string };

export default async function CoursesPage() {
  const [coursesRes, platformsRes, skillsRes] = await Promise.all([
    apiServerSafe<Course[]>("/api/courses"),
    apiServerSafe<Platform[]>("/api/platforms"),
    apiServerSafe<Skill[]>("/api/skills")
  ]);

  return (
    <CoursesAdmin
      rows={coursesRes.data ?? []}
      platforms={(platformsRes.data ?? []).map((p) => ({ id: p.id, nameAr: p.nameAr }))}
      skills={(skillsRes.data ?? []).map((s) => ({ id: s.id, nameAr: s.nameAr }))}
    />
  );
}
