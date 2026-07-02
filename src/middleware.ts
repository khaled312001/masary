import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

export const config = {
  matcher: ["/admin/:path*", "/secert/:path*"]
};

const TOKEN_COOKIE = "masary_admin_token";
const SECRET_COOKIE = "masary_secret_token";

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) return null;
  return new TextEncoder().encode(secret);
}

async function verify(token: string) {
  const key = secretKey();
  if (!key) return null;
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ─── Secret reference page ───
  if (pathname === "/secert" || pathname.startsWith("/secert/")) {
    if (pathname === "/secert/login") return NextResponse.next();
    const token = req.cookies.get(SECRET_COOKIE)?.value;
    const session = token ? await verify(token) : null;
    if (!session || session.scope !== "secret") {
      const url = req.nextUrl.clone();
      url.pathname = "/secert/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ─── Admin dashboard ───
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  const session = token ? await verify(token) : null;

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
