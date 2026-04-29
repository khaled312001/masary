export type AnalysisReport = {
  summary: string;
  encouragement: string;
  matchScore: number;
  presentSkills: { name: string; note?: string }[];
  missingSkills: { name: string; importance: number; note?: string }[];
  partialSkills: { name: string; note?: string }[];
  learningPath: {
    step: number;
    title: string;
    skills: string[];
    durationWeeks: number;
    description: string;
    courses: { title: string; platform?: string; url?: string; isFree?: boolean }[];
  }[];
  suggestedCourses: { title: string; platform?: string; url?: string; reason: string }[];
  suggestedEmployers: { name: string; reason: string }[];
  finalAdvice: string;
};
