"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle2, AlertCircle, Upload } from "lucide-react";

export function ReceiptForm({
  reportId,
  defaultName,
  defaultEmail
}: {
  reportId: string;
  defaultName?: string;
  defaultEmail?: string | null;
}) {
  const [name, setName] = useState(defaultName || "");
  const [email, setEmail] = useState(defaultEmail || "");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setError(null);
    if (name.trim().length < 2) {
      setError("أدخل اسمك الكامل");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("صيغة البريد غير صحيحة");
      return;
    }
    if (message.trim().length < 5) {
      setError("أضف رقم العملية أو وصف إيصال التحويل");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/proxy/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          message: message.trim(),
          topic: "payment-receipt",
          reportId
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "تعذر إرسال الإيصال");
      setDone(true);
    } catch (err: any) {
      setError(err?.message || "تعذر إرسال الإيصال");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 text-green-800 p-5 flex items-start gap-3 animate-fade-in">
        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold">استلمنا إيصالك</div>
          <p className="text-sm mt-1">سنفعّل تقريرك خلال 30 دقيقة (أيام العمل) وستصلك رسالة تأكيد على بريدك.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          className="input"
          placeholder="الاسم الكامل"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={150}
          autoComplete="name"
        />
        <input
          type="email"
          className="input"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={180}
          autoComplete="email"
          dir="ltr"
        />
      </div>
      <input
        type="tel"
        className="input"
        placeholder="رقم الجوال (اختياري)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        maxLength={30}
        autoComplete="tel"
        dir="ltr"
      />
      <textarea
        className="input min-h-24 resize-y"
        placeholder="رقم عملية التحويل، تاريخها، وأي ملاحظة..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={4000}
      />
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}
      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        إرسال الإيصال
      </button>
      <p className="text-[11px] text-stone-400 text-center inline-flex items-center justify-center gap-1 w-full">
        <Upload className="w-3 h-3" />
        لإرفاق صورة الإيصال استخدم زر واتساب أعلاه
      </p>
    </form>
  );
}
