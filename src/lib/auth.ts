import { cookies } from "next/headers";
import { verifySession, signSession, SESSION_COOKIE } from "./jwt";

export { signSession, verifySession, SESSION_COOKIE };

export async function setSessionCookie(token: string) {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearSessionCookie() {
  cookies().delete(SESSION_COOKIE);
}

export async function getCurrentAdmin() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return await verifySession(token);
}
