import Anthropic from "@anthropic-ai/sdk";
import { jsonrepair } from "jsonrepair";
import { getSettingValue } from "./settings";

export const ANALYSIS_MODEL = "claude-sonnet-4-6";

export async function getClient() {
  const key = await getSettingValue("ANTHROPIC_API_KEY");
  if (!key) {
    throw new Error(
      "مفتاح ANTHROPIC_API_KEY غير مهيأ. أضفه من صفحة الإعدادات في لوحة التحكم."
    );
  }
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
  cvText?: string;
  cvFile?: {
    mediaType: string;
    dataBase64: string;
  };
  normalizedJobTitle?: string;
  normalizedSkills?: string[];
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

export type ClaudeUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  model: string;
};

const SYSTEM_PROMPT = `أنت مستشار مهني خبير في سوق العمل السعودي والخليجي. مهمتك تحليل الفجوة بين مهارات المستخدم الحالية والمهارات المطلوبة لوظيفة معينة، ثم رسم مسار تعلم عملي وواقعي.

قواعد صارمة:
1. أجب باللغة العربية الفصحى البسيطة بنبرة لطيفة محفزة (مناسبة للسوق السعودي والخليجي).
2. أعد إجابتك بصيغة JSON صحيحة 100% فقط، بدون أي نص قبل أو بعد JSON.
3. اربط النصائح ببيانات الوظائف والمهارات والكورسات والشركات المقدمة. عند نقص البيانات، استخدم معرفتك العامة بدون اختراع روابط غير موجودة.
4. matchScore يجب أن يكون رقم بين 0 و 100 يعكس نسبة تطابق المهارات الحالية مع المطلوبة.
5. learningPath: من 3 إلى 6 خطوات مرتبة منطقياً من الأساسيات إلى المتقدم.
6. استفد من نص السيرة الذاتية إن وجد، واستخرج منه قرائن المهارات والدورات والخبرة بالعربية أو الإنجليزية.
7. كن دقيقاً ومحفزاً وعملياً.`;

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

export async function analyzeWithClaude(input: AnalysisInput): Promise<{ report: AnalysisReport; usage: ClaudeUsage }> {
  const client = await getClient();

  const userPayload = {
    user: {
      fullName: input.fullName,
      jobTitle: input.jobTitle,
      normalizedJobTitle: input.normalizedJobTitle || null,
      employer: input.employer || null,
      currentSkills: input.currentSkills,
      currentCourses: input.currentCourses || null,
      normalizedSkills: input.normalizedSkills || [],
      cvText: input.cvText || null
    },
    matchedJob: input.matchedJob,
    catalog: {
      courses: input.catalogCourses,
      companies: input.catalogCompanies
    }
  };

  const userMessage = `${SCHEMA_HINT}\n\nبيانات المستخدم والكتالوج:\n${JSON.stringify(userPayload, null, 2)}\n\nأعد JSON فقط بدون أي نص قبله أو بعده.`;
  const content: any[] = [];
  if (input.cvFile?.mediaType === "application/pdf") {
    content.push({
      type: "document",
      source: {
        type: "base64",
        media_type: input.cvFile.mediaType,
        data: input.cvFile.dataBase64
      }
    });
  } else if (input.cvFile?.mediaType.startsWith("image/")) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: input.cvFile.mediaType,
        data: input.cvFile.dataBase64
      }
    });
  }
  content.push({ type: "text", text: userMessage });

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await client.messages.create({
        model: ANALYSIS_MODEL,
        max_tokens: 6000,
        temperature: attempt === 0 ? 0.3 : 0.1,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content }]
      });

      const text = response.content
        .map((c) => (c.type === "text" ? c.text : ""))
        .join("\n")
        .trim();

      const jsonText = extractJson(text);
      const parsed = parseJsonSafely(jsonText);
      return {
        report: normalize(parsed),
        usage: {
          inputTokens: response.usage.input_tokens ?? 0,
          outputTokens: response.usage.output_tokens ?? 0,
          totalTokens: (response.usage.input_tokens ?? 0) + (response.usage.output_tokens ?? 0),
          model: ANALYSIS_MODEL
        }
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (!/تعذّر قراءة استجابة/.test(lastError.message)) throw lastError;
    }
  }
  throw lastError ?? new Error("فشل تحليل الذكاء الاصطناعي");
}

function extractJson(text: string): string {
  const fenceMatch = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) return text.slice(start, end + 1);
  return text;
}

function parseJsonSafely(jsonText: string): AnalysisReport {
  try {
    return JSON.parse(jsonText) as AnalysisReport;
  } catch {
    /* fall through */
  }
  const cleaned = jsonText
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/,(\s*[}\]])/g, "$1");
  try {
    return JSON.parse(cleaned) as AnalysisReport;
  } catch {
    /* fall through */
  }
  try {
    const repaired = jsonrepair(jsonText);
    return JSON.parse(repaired) as AnalysisReport;
  } catch {
    throw new Error(
      "تعذّر قراءة استجابة الذكاء الاصطناعي. حاول مرة أخرى — قد تكون الاستجابة قد قُطعت."
    );
  }
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
