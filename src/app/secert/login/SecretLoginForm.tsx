"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldAlert, Loader2 } from "lucide-react";

export function SecretLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/secret/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "تعذر تسجيل الدخول");
      router.replace("/secert");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "تعذر تسجيل الدخول");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-sm rounded-3xl border border-stone-800 bg-stone-900 p-8 shadow-2xl"
    >
      <div className="w-14 h-14 mx-auto rounded-2xl bg-stone-800 flex items-center justify-center">
        <Lock className="w-7 h-7 text-amber-400" />
      </div>
      <h1 className="mt-4 text-center text-xl font-extrabold text-white">صفحة محمية</h1>
      <p className="mt-1 text-center text-sm text-stone-400">أدخل كلمة المرور للوصول للمرجع</p>

      <div className="mt-6">
        <input
          type="password"
          autoFocus
          dir="ltr"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
          className="w-full rounded-xl bg-stone-800 border border-stone-700 text-white px-4 py-3 text-center tracking-widest outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
        />
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-950/60 border border-red-900 text-red-300 px-3 py-2 text-sm">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !password}
        className="mt-5 w-full rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-900 font-bold px-4 py-3 transition flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
        دخول
      </button>
    </form>
  );
}
