import { redirect } from "next/navigation";
import { hasSecretSession, loadSecretData } from "@/lib/secret-auth";
import { SecretDashboard } from "./SecretDashboard";

export const dynamic = "force-dynamic";

export const metadata = { title: "مرجع بيانات المواقع", robots: { index: false, follow: false } };

export default async function SecretPage() {
  // Middleware also gates this, but double-check server-side.
  if (!(await hasSecretSession())) redirect("/secert/login");

  const data = loadSecretData();

  if (!data) {
    return (
      <main className="min-h-screen bg-stone-950 text-stone-200 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-extrabold text-white">لم تُهيّأ البيانات بعد</h1>
          <p className="mt-3 text-stone-400 text-sm leading-relaxed">
            ملف البيانات <code className="text-amber-400">secret-data.json</code> غير موجود على
            الخادم. ضعه في مجلد التطبيق ثم أعد تحميل الصفحة.
          </p>
        </div>
      </main>
    );
  }

  return <SecretDashboard data={data} />;
}
