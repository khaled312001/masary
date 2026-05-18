import { prisma } from "./prisma";

export const ALLOWED_SETTING_KEYS = ["ANTHROPIC_API_KEY"] as const;
export type AllowedSettingKey = (typeof ALLOWED_SETTING_KEYS)[number];

export function isAllowedSettingKey(k: string): k is AllowedSettingKey {
  return (ALLOWED_SETTING_KEYS as readonly string[]).includes(k);
}

// DB-first, env fallback.
export async function getSettingValue(key: AllowedSettingKey): Promise<string | null> {
  try {
    const found = await prisma.setting.findUnique({ where: { key } });
    if (found?.value) return found.value;
  } catch {
    /* ignore */
  }
  return process.env[key] || null;
}

export function maskSecret(value: string) {
  if (value.length <= 8) return "•".repeat(value.length);
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}
