import { redirect } from "next/navigation";
import { hasSecretSession } from "@/lib/secret-auth";
import { SecretLoginForm } from "./SecretLoginForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "دخول محمي", robots: { index: false, follow: false } };

export default async function SecretLoginPage() {
  if (await hasSecretSession()) redirect("/secert");
  return (
    <main className="min-h-screen bg-stone-950 flex items-center justify-center px-4 py-10">
      <SecretLoginForm />
    </main>
  );
}
