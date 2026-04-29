"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Trash2, Plus, X } from "lucide-react";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "url" | "checkbox" | "select";
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
};

export type Row = Record<string, any> & { id: string };

export function CrudTable({
  title,
  endpoint,
  fields,
  rows,
  columns
}: {
  title: string;
  endpoint: string; // e.g. /api/admin/skills
  fields: FieldDef[];
  rows: Row[];
  columns: { key: string; label: string; render?: (row: Row) => React.ReactNode }[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Row | null>(null);
  const [adding, setAdding] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function blank(): Record<string, any> {
    const o: Record<string, any> = {};
    for (const f of fields) {
      o[f.name] = f.type === "checkbox" ? false : "";
    }
    return o;
  }

  const [draft, setDraft] = useState<Record<string, any>>(blank());

  function startAdd() {
    setDraft(blank());
    setEditing(null);
    setAdding(true);
    setError(null);
  }
  function startEdit(r: Row) {
    const d: Record<string, any> = {};
    for (const f of fields) {
      const v = r[f.name];
      d[f.name] = v === null || v === undefined ? (f.type === "checkbox" ? false : "") : v;
    }
    setDraft(d);
    setEditing(r);
    setAdding(true);
    setError(null);
  }
  function cancel() {
    setAdding(false);
    setEditing(null);
    setError(null);
  }

  async function save() {
    setWorking(true);
    setError(null);
    try {
      const url = editing ? `${endpoint}/${editing.id}` : endpoint;
      const method = editing ? "PATCH" : "POST";
      const body = { ...draft };
      // Convert numeric strings
      for (const f of fields) {
        if (f.type === "number" && body[f.name] !== "" && body[f.name] !== null) {
          const n = Number(body[f.name]);
          body[f.name] = Number.isNaN(n) ? null : n;
        }
        if ((f.type === "text" || f.type === "textarea" || f.type === "url" || f.type === "select") && body[f.name] === "") {
          if (!f.required) body[f.name] = null;
        }
      }
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "تعذر الحفظ");
      cancel();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setWorking(false);
    }
  }

  async function remove(r: Row) {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    setWorking(true);
    try {
      const res = await fetch(`${endpoint}/${r.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "تعذر الحذف");
      }
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900">{title}</h1>
        <button onClick={startAdd} className="btn-primary !py-2 !px-4 text-sm">
          <Plus className="w-4 h-4" /> إضافة
        </button>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-stone-600 text-xs">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="text-right p-3 font-semibold">{c.label}</th>
                ))}
                <th className="p-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="p-8 text-center text-stone-500">
                    لا توجد بيانات بعد
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-stone-100 hover:bg-stone-50">
                  {columns.map((c) => (
                    <td key={c.key} className="p-3 text-stone-800">
                      {c.render ? c.render(r) : (r[c.key] ?? "—")}
                    </td>
                  ))}
                  <td className="p-3 text-left">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => startEdit(r)} className="p-2 rounded-lg hover:bg-brand-50 text-brand-700">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => remove(r)} className="p-2 rounded-lg hover:bg-red-50 text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {adding && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-3">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-stone-100 sticky top-0 bg-white">
              <h2 className="text-lg font-bold">{editing ? "تعديل" : "إضافة جديد"}</h2>
              <button onClick={cancel} className="p-2 rounded-lg hover:bg-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {fields.map((f) => (
                <div key={f.name}>
                  <label className="label">
                    {f.label} {f.required && <span className="text-red-500">*</span>}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      className="input min-h-24"
                      value={draft[f.name] ?? ""}
                      onChange={(e) => setDraft((d) => ({ ...d, [f.name]: e.target.value }))}
                      placeholder={f.placeholder}
                    />
                  ) : f.type === "checkbox" ? (
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={!!draft[f.name]}
                        onChange={(e) => setDraft((d) => ({ ...d, [f.name]: e.target.checked }))}
                      />
                      {f.placeholder || f.label}
                    </label>
                  ) : f.type === "select" ? (
                    <select
                      className="input"
                      value={draft[f.name] ?? ""}
                      onChange={(e) => setDraft((d) => ({ ...d, [f.name]: e.target.value }))}
                    >
                      <option value="">— اختر —</option>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}
                      className="input"
                      value={draft[f.name] ?? ""}
                      onChange={(e) => setDraft((d) => ({ ...d, [f.name]: e.target.value }))}
                      placeholder={f.placeholder}
                    />
                  )}
                </div>
              ))}
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                  {error}
                </div>
              )}
            </div>
            <div className="p-5 border-t border-stone-100 flex justify-end gap-2 sticky bottom-0 bg-white">
              <button onClick={cancel} className="btn-secondary !py-2 !px-4 text-sm">إلغاء</button>
              <button onClick={save} disabled={working} className="btn-primary !py-2 !px-4 text-sm">
                {working ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
