import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { ALLOWED_SETTING_KEYS, maskSecret } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const rows = await prisma.setting.findMany();
  const map: Record<string, { configured: boolean; preview: string | null; updatedAt: string | null }> = {};
  for (const k of ALLOWED_SETTING_KEYS) {
    const found = rows.find((r) => r.key === k);
    map[k] = found
      ? {
          configured: true,
          preview: maskSecret(found.value),
          updatedAt: found.updatedAt.toISOString()
        }
      : {
          configured: !!process.env[k],
          preview: process.env[k] ? maskSecret(process.env[k] as string) + " (env)" : null,
          updatedAt: null
        };
  }
  return NextResponse.json(map);
}
