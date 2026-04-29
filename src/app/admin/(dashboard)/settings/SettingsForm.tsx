"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, KeyRound, Eye, EyeOff, Trash2, CheckCircle2 } from "lucide-react";

type Current = { configured: boolean; preview: string | null; updatedAt: string | null } | undefined;

export function SettingsForm({
  settingKey,
  title,
  description,
  placeholder,
  current
}: {
  settingKey: string;
  title: string;
  description: string;
  placeholder: string;
  current: Current;
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) {
      setMsg({ type: "error", text: "أدخل قيمة المفتاح أولاً" });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/proxy/api/settings/${settingKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: value.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "تعذر الحفظ");
      setValue("");
      setMsg({ type: "success", text: "تم الحفظ بنجاح" });
      router.refresh();
    } catch (e: any) {
      setMsg({ type: "error", text: e.message });
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm("حذف المفتاح المحفوظ؟ سيعود لاستخدام قيمة env (إن وُجدت).")) return;
    setRemoving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/proxy/api/settings/${settingKey}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "تعذر الحذف");
      }
      setMsg({ type: "success", text: "تم حذف المفتاح" });
      router.refresh();
    } catch (e: any) {
      setMsg({ type: "error", text: e.message });
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="card !p-6 space-y-4">
      <div>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-brand-600" />
            {title}
          </h2>
          {current?.configured && (
            <span className="pill bg-green-100 text-green-700">
              <CheckCircle2 className="w-3 h-3" />
              مهيأ
            </span>
          )}
        </div>
        <p className="text-sm text-stone-600 mt-1">{description}</p>
      </div>

      {current?.configured && current.preview && (
        <div className="rounded-xl bg-stone-50 border border-stone-100 p-3 text-sm flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-stone-500">القيمة الحالية</div>
            <div className="font-mono text-stone-800 mt-0.5">{current.preview}</div>
            {current.updatedAt && (
              <div className="text-[11px] text-stone-400 mt-1">
                آخر تحديث: {new Date(current.updatedAt).toLocaleString("ar-SA")}
              </div>
            )}
          </div>
          {current.updatedAt && (
            <button
              onClick={remove}
              disabled={removing}
              className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition disabled:opacity-50"
              title="حذف"
            >
              {removing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      )}

      <form onSubmit={save} className="space-y-3">
        <label className="label">
          {current?.configured ? "تحديث المفتاح" : "إضافة المفتاح"}
        </label>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            className="input !pe-11 font-mono text-sm"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 left-2 flex items-center px-2 text-stone-400 hover:text-stone-700"
            tabIndex={-1}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {msg && (
          <div
            className={`rounded-xl px-4 py-2 text-sm border ${
              msg.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {msg.text}
          </div>
        )}

        <button type="submit" className="btn-primary w-full" disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          حفظ
        </button>
      </form>
    </div>
  );
}
