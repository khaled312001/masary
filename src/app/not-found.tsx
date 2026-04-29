import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 md:px-8 py-24 text-center">
        <div className="text-7xl font-extrabold bg-gradient-to-l from-brand-600 to-brand-800 bg-clip-text text-transparent">
          404
        </div>
        <h1 className="mt-4 text-2xl font-bold text-stone-900">الصفحة غير موجودة</h1>
        <p className="mt-2 text-stone-600">الرابط الذي تبحث عنه غير صحيح أو تم إزالته.</p>
        <Link href="/" className="btn-primary mt-6">العودة للرئيسية</Link>
      </main>
      <Footer />
    </>
  );
}
