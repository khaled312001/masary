import { Logo } from "@/components/Logo";
import { LoginForm } from "./LoginForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Logo size={48} />
          </Link>
        </div>
        <div className="card !p-8">
          <h1 className="text-2xl font-extrabold text-stone-900 text-center">دخول لوحة التحكم</h1>
          <p className="text-stone-500 text-sm text-center mt-1">للمشرفين فقط</p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-stone-500">
          عودة إلى{" "}
          <Link href="/" className="text-brand-700 hover:underline">
            الصفحة الرئيسية
          </Link>
        </p>
      </div>
    </main>
  );
}
