import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { TOKEN_COOKIE } from "@/lib/api";

export const runtime = "nodejs";

export async function POST() {
  cookies().delete(TOKEN_COOKIE);
  return NextResponse.json({ ok: true });
}
