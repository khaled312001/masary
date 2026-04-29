"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-stone-600 hover:bg-red-50 hover:text-red-700 transition"
    >
      <LogOut className="w-4 h-4" />
      تسجيل الخروج
    </button>
  );
}
