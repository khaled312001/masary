import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SECRET_COOKIE } from "@/lib/secret-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  cookies().delete(SECRET_COOKIE);
  return NextResponse.json({ ok: true });
}
