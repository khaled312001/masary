import { NextResponse } from "next/server";
import { API_URL, getServerToken } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Allow long-running AI analysis (Vercel default is 10s on Hobby; Pro allows up to 60s).
export const maxDuration = 60;

async function proxy(req: Request, params: { path: string[] }, method: string) {
  const path = "/" + params.path.join("/");
  const url = new URL(req.url);
  const target = `${API_URL}${path}${url.search}`;
  const token = getServerToken();
  const contentType = req.headers.get("content-type") || "";

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let body: BodyInit | undefined;
  if (method !== "GET" && method !== "HEAD" && method !== "DELETE") {
    if (contentType.includes("multipart/form-data")) {
      // Forward the raw body untouched so multer can parse it on the backend.
      body = Buffer.from(await req.arrayBuffer());
      headers["Content-Type"] = contentType;
    } else if (contentType) {
      body = await req.text();
      headers["Content-Type"] = contentType;
    }
  }

  try {
    const res = await fetch(target, {
      method,
      headers,
      body,
      cache: "no-store"
    });

    const text = await res.text();
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text.slice(0, 500) };
      }
    }

    return NextResponse.json(data ?? {}, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "تعذر الاتصال بالخادم" },
      { status: 502 }
    );
  }
}

export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  return proxy(req, params, "GET");
}
export async function POST(req: Request, { params }: { params: { path: string[] } }) {
  return proxy(req, params, "POST");
}
export async function PUT(req: Request, { params }: { params: { path: string[] } }) {
  return proxy(req, params, "PUT");
}
export async function PATCH(req: Request, { params }: { params: { path: string[] } }) {
  return proxy(req, params, "PATCH");
}
export async function DELETE(req: Request, { params }: { params: { path: string[] } }) {
  return proxy(req, params, "DELETE");
}
