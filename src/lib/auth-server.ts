import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySession } from "./jwt";

export const TOKEN_COOKIE = "masary_admin_token";

export async function getAdminSession() {
  const token = cookies().get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getAdminSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
  }
  return null;
}
