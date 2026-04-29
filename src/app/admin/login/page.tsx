import { Suspense } from "react";
import { Logo } from "@/components/Logo";
import { LoginForm } from "./LoginForm";
import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-mesh flex items-center justify-center px-4 py-10">
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-brand-200/30 blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-gold-200/30 blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: "1.5s" }} />

      <div className="w-full max-w-md relative animate-scale-in">
        <div className="flex justify-center mb-8">
          <Link href="/" className="hover:scale-105 transition-transform">
            <Logo size={56} />
          </Link>
        </div>
        <div className="rounded-3xl bg-white shadow-2xl shadow-brand-900/10 border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 px-8 py-6 text-white relative overflow-hidden">
            <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-gold-400/20 blur-2xl animate-pulse-slow" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                دخول آمن
              </div>
              <h1 className="mt-3 text-2xl font-extrabold">لوحة التحكم</h1>
              <p className="text-white/80 text-sm mt-1">مرحباً بك، أدخل بيانات المشرف للمتابعة</p>
            </div>
          </div>
          <div className="p-8">
            <Suspense fallback={<div className="h-40" />}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-stone-500">
          <Sparkles className="inline w-3 h-3 me-1 text-gold-500" />
          مساري — مسارك المهني يبدأ من هنا
        </p>
        <p className="mt-2 text-center text-xs text-stone-400">
          <Link href="/" className="hover:text-brand-700 transition">
            العودة إلى الصفحة الرئيسية
          </Link>
        </p>
      </div>
    </main>
  );
}
