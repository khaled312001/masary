"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card !p-8 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">حدث خطأ في تحميل الصفحة</h2>
        <p className="text-stone-600 text-sm">
          الأرجح أن قاعدة البيانات غير متصلة. تحقق من <code className="bg-stone-100 px-1.5 py-0.5 rounded text-xs">DATABASE_URL</code> في Vercel،
          ومن تفعيل <strong>Any Host</strong> في Hostinger.
        </p>
        {error.digest && (
          <p className="text-xs text-stone-400">معرّف الخطأ: {error.digest}</p>
        )}
        <div className="flex justify-center gap-2 pt-2">
          <button onClick={reset} className="btn-primary !py-2 !px-4 text-sm">
            <RefreshCw className="w-4 h-4" /> إعادة المحاولة
          </button>
          <Link href="/api/healthz" target="_blank" className="btn-secondary !py-2 !px-4 text-sm">
            تشخيص /healthz
          </Link>
          <Link href="/" className="btn-secondary !py-2 !px-4 text-sm">
            <Home className="w-4 h-4" /> الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
