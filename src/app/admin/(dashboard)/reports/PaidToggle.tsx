"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";

export function PaidToggle({ id, isPaid: initial }: { id: string; isPaid: boolean }) {
  const router = useRouter();
  const [isPaid, setIsPaid] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    const next = !isPaid;
    if (
      next &&
      !confirm("تأكيد تفعيل التقرير كمدفوع؟ سيتمكن المستخدم من التنزيل والشهادة.")
    )
      return;
    if (
      !next &&
      !confirm("إلغاء التفعيل؟ سيُحظر تنزيل التقرير على المستخدم.")
    )
      return;

    setBusy(true);
    try {
      const path = next ? "mark-paid" : "mark-unpaid";
      const res = await fetch(`/api/proxy/api/reports/${id}/${path}`, {
        method: "POST"
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "تعذر التعديل");
      }
      setIsPaid(next);
      router.refresh();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (isPaid) {
    return (
      <button
        onClick={toggle}
        disabled={busy}
        className="inline-flex items-center gap-1.5 rounded-full bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 text-xs font-bold transition disabled:opacity-50"
        title="إلغاء التفعيل"
      >
        {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
        مدفوع
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 text-xs font-semibold transition disabled:opacity-50"
      title="تأكيد الدفع"
    >
      {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Clock className="w-3 h-3" />}
      تفعيل الدفع
    </button>
  );
}
