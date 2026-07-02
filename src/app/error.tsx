"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-stone-50">
      <div className="max-w-md w-full text-center bg-white rounded-3xl border border-stone-100 shadow-sm p-8">
        <h1 className="text-2xl font-extrabold text-stone-900">حدث خطأ غير متوقع</h1>
        <p className="mt-2 text-stone-600">
          نأسف على الإزعاج. يمكنك المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-xl bg-brand-700 hover:bg-brand-800 text-white px-5 py-2.5 text-sm font-bold transition"
          >
            إعادة المحاولة
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 px-5 py-2.5 text-sm font-bold transition"
          >
            الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}
