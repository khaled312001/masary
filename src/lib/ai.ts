import Anthropic from "@anthropic-ai/sdk";

export const ANALYSIS_MODEL = "claude-sonnet-4-6";

export function getClient() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not configured");
  return new Anthropic({ apiKey: key });
}

export type SkillRow = { nameAr: string; importance?: number };
export type CourseRow = {
  titleAr: string;
  url?: string | null;
  platformAr?: string | null;
  isFree?: boolean;
  durationHrs?: number | null;
  level?: string | null;
  skills?: string[];
};

export type AnalysisInput = {
  fullName: string;
  jobTitle: string;
  employer?: string;
  currentSkills: string;
  currentCourses?: string;
  matchedJob: {
    titleAr: string;
    descriptionAr: string;
    requiredSkills: SkillRow[];
  } | null;
  catalogCourses: CourseRow[];
  catalogCompanies: { nameAr: string; industry?: string | null }[];
};

export type AnalysisReport = {
  summary: string;
  encouragement: string;
  matchScore: number; // 0..100
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

const SYSTEM_PROMPT = `أنت مستشار مهني خبير في سوق العمل السعودي والخليجي. مهمتك تحليل الفجوة بين مهارات المستخدم الحالية والمهارات المطلوبة لوظيفة معينة، ثم رسم مسار تعلم عملي وواقعي.

قواعد صارمة:
1. أجب باللغة العربية الفصحى البسيطة بنبرة لطيفة محفزة (مناسبة للسوق السعودي والخليجي).
2. أعد إجابتك بصيغة JSON صحيحة 100% فقط، بدون أي نص قبل أو بعد JSON.
3. اعتمد فقط على البيانات المقدمة لك في catalog (الكورسات وجهات العمل) عند الترشيح، ويمكنك إضافة اقتراحات عامة إذا كانت بدون رابط محدد.
4. matchScore يجب أن يكون رقم بين 0 و 100 يعكس نسبة تطابق المهارات الحالية مع المطلوبة.
5. learningPath: من 3 إلى 6 خطوات مرتبة منطقياً من الأساسيات إلى المتقدم.
6. كن دقيقاً ومحفزاً وعملياً.`;

const SCHEMA_HINT = `الـ JSON المتوقع:
{
  "summary": "ملخص قصير عن الوضع الحالي للمستخدم وفجواته",
  "encouragement": "رسالة تحفيزية شخصية مع ذكر اسم المستخدم",
  "matchScore": 65,
  "presentSkills": [{"name":"...","note":"..."}],
  "missingSkills": [{"name":"...","importance":4,"note":"..."}],
  "partialSkills": [{"name":"...","note":"..."}],
  "learningPath": [
    {"step":1,"title":"...","skills":["..."],"durationWeeks":4,"description":"...","courses":[{"title":"...","platform":"...","url":"...","isFree":true}]}
  ],
  "suggestedCourses": [{"title":"...","platform":"...","url":"...","reason":"..."}],
  "suggestedEmployers": [{"name":"...","reason":"..."}],
  "finalAdvice": "..."
}`;

export async function analyzeWithClaude(input: AnalysisInput): Promise<AnalysisReport> {
  const client = getClient();

  const userPayload = {
    user: {
      fullName: input.fullName,
      jobTitle: input.jobTitle,
      employer: input.employer || null,
      currentSkills: input.currentSkills,
      currentCourses: input.currentCourses || null
    },
    matchedJob: input.matchedJob,
    catalog: {
      courses: input.catalogCourses,
      companies: input.catalogCompanies
    }
  };

  const userMessage = `${SCHEMA_HINT}\n\nبيانات المستخدم والكتالوج:\n${JSON.stringify(userPayload, null, 2)}\n\nأعد JSON فقط.`;

  const response = await client.messages.create({
    model: ANALYSIS_MODEL,
    max_tokens: 4000,
    temperature: 0.3,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }]
  });

  const text = response.content
    .filter((c): c is Anthropic.TextBlock => c.type === "text")
    .map((c) => c.text)
    .join("\n")
    .trim();

  const jsonText = extractJson(text);
  const parsed = JSON.parse(jsonText) as AnalysisReport;
  return normalize(parsed);
}

function extractJson(text: string): string {
  const fenceMatch = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) return text.slice(start, end + 1);
  return text;
}

function normalize(r: AnalysisReport): AnalysisReport {
  return {
    summary: r.summary || "",
    encouragement: r.encouragement || "",
    matchScore: Math.max(0, Math.min(100, Math.round(Number(r.matchScore) || 0))),
    presentSkills: r.presentSkills || [],
    missingSkills: r.missingSkills || [],
    partialSkills: r.partialSkills || [],
    learningPath: (r.learningPath || []).map((s, i) => ({ ...s, step: s.step ?? i + 1 })),
    suggestedCourses: r.suggestedCourses || [],
    suggestedEmployers: r.suggestedEmployers || [],
    finalAdvice: r.finalAdvice || ""
  };
}
