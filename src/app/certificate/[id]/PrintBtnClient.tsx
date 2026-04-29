"use client";

import { Printer } from "lucide-react";

export function PrintBtnClient() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 text-sm font-semibold transition active:scale-95"
    >
      <Printer className="w-4 h-4" />
      تنزيل / طباعة
    </button>
  );
}
