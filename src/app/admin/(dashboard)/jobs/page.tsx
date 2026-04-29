import { JobsAdmin } from "./JobsAdmin";
import { apiServerSafe } from "@/lib/api";

export const dynamic = "force-dynamic";

type Job = {
  id: string;
  titleAr: string;
  titleEn: string | null;
  descriptionAr: string;
  category: string | null;
  level: string | null;
  skills: { skillId: string; nameAr: string; importance: number }[];
};
type Skill = { id: string; nameAr: string };

export default async function JobsPage() {
  const [jobsRes, skillsRes] = await Promise.all([
    apiServerSafe<Job[]>("/api/jobs"),
    apiServerSafe<Skill[]>("/api/skills")
  ]);
  return (
    <JobsAdmin
      rows={jobsRes.data ?? []}
      skills={(skillsRes.data ?? []).map((s) => ({ id: s.id, nameAr: s.nameAr }))}
    />
  );
}
