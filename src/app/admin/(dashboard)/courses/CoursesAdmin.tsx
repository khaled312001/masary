"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, X, ExternalLink } from "lucide-react";

type Option = { id: string; nameAr: string };

type Row = {
  id: string;
  titleAr: string;
  titleEn: string | null;
  description: string | null;
  url: string | null;
  durationHrs: number | null;
  level: string | null;
  isFree: boolean;
  language: string | null;
  platformId: string | null;
  platformName: string | null;
  skillIds: string[];
  skillNames: string[];
};

export function CoursesAdmin({
  rows,
  platforms,
  skills
}: {
  rows: Row[];
  platforms: Option[];
  skills: Option[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    titleAr: "",
    titleEn: "",
    description: "",
    url: "",
    durationHrs: "",
    level: "",
    isFree: false,
    language: "ar",
    platformId: "",
    skillIds: [] as string[]
  });

  function blank() {
    setDraft({
      titleAr: "",
      titleEn: "",
      description: "",
      url: "",
      durationHrs: "",
      level: "",
      isFree: false,
      language: "ar",
      platformId: "",
      skillIds: []
    });
  }

  function startAdd() {
    blank();
    setEditing(null);
    setOpen(true);
    setError(null);
  }
  function startEdit(r: Row) {
    setDraft({
      titleAr: r.titleAr,
      titleEn: r.titleEn ?? "",
      description: r.description ?? "",
      url: r.url ?? "",
      durationHrs: r.durationHrs ? String(r.durationHrs) : "",
      level: r.level ?? "",
      isFree: r.isFree,
      language: r.language ?? "ar",
      platformId: r.platformId ?? "",
      skillIds: r.skillIds
    });
    setEditing(r);
    setOpen(true);
    setError(null);
  }
  function cancel() {
    setOpen(false);
    setEditing(null);
    setError(null);
  }

  async function save() {
    setWorking(true);
    setError(null);
    try {
      const body: any = {
        titleAr: draft.titleAr,
        titleEn: draft.titleEn || null,
        description: draft.description || null,
        url: draft.url || null,
        durationHrs: draft.durationHrs ? Number(draft.durationHrs) : null,
        level: draft.level || null,
        isFree: draft.isFree,
        language: draft.language || "ar",
        platformId: draft.platformId || null,
        skillIds: draft.skillIds
      };
      const res = await fetch(
        editing ? `/api/proxy/api/courses/${editing.id}` : "/api/proxy/api/courses",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "تعذر الحفظ");
      cancel();
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setWorking(false);
    }
  }

  async function remove(r: Row) {
    if (!confirm("حذف هذا الكورس؟")) return;
    setWorking(true);
    try {
      const res = await fetch(`/api/proxy/api/courses/${r.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "تعذر الحذف");
      }
      router.refresh();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setWorking(false);
    }
  }

  function toggleSkill(id: string) {
    setDraft((d) => {
      const has = d.skillIds.includes(id);
      return { ...d, skillIds: has ? d.skillIds.filter((x) => x !== id) : [...d.skillIds, id] };
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900">الكورسات</h1>
        <button onClick={startAdd} className="btn-primary !py-2 !px-4 text-sm">
          <Plus className="w-4 h-4" /> إضافة كورس
        </button>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-stone-600 text-xs">
              <tr>
                <th className="text-right p-3 font-semibold">العنوان</th>
                <th className="text-right p-3 font-semibold">المنصة</th>
                <th className="text-right p-3 font-semibold">المهارات</th>
                <th className="text-right p-3 font-semibold">السعر</th>
                <th className="text-right p-3 font-semibold">المدة</th>
                <th className="text-right p-3 font-semibold">الرابط</th>
                <th className="p-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-500">
                    لا توجد كورسات بعد
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-stone-100 hover:bg-stone-50">
                  <td className="p-3 font-semibold text-stone-900 max-w-[260px]">{r.titleAr}</td>
                  <td className="p-3 text-stone-700">{r.platformName ?? "—"}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {r.skillNames.slice(0, 3).map((s) => (
                        <span key={s} className="pill bg-brand-50 text-brand-700">{s}</span>
                      ))}
                      {r.skillNames.length > 3 && (
                        <span className="pill bg-stone-100 text-stone-600">+{r.skillNames.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    {r.isFree ? <span className="pill bg-green-100 text-green-700">مجاني</span> : "—"}
                  </td>
                  <td className="p-3 text-stone-700">{r.durationHrs ? `${r.durationHrs} س` : "—"}</td>
                  <td className="p-3">
                    {r.url ? (
                      <a href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand-700 hover:underline">
                        رابط <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : "—"}
                  </td>
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

      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-3">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-stone-100 sticky top-0 bg-white">
              <h2 className="text-lg font-bold">{editing ? "تعديل كورس" : "إضافة كورس"}</h2>
              <button onClick={cancel} className="p-2 rounded-lg hover:bg-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="label">العنوان بالعربية <span className="text-red-500">*</span></label>
                <input className="input" value={draft.titleAr} onChange={(e) => setDraft((d) => ({ ...d, titleAr: e.target.value }))} />
              </div>
              <div>
                <label className="label">العنوان بالإنجليزية</label>
                <input className="input" value={draft.titleEn} onChange={(e) => setDraft((d) => ({ ...d, titleEn: e.target.value }))} />
              </div>
              <div>
                <label className="label">الوصف</label>
                <textarea className="input min-h-20" value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">المنصة</label>
                  <select className="input" value={draft.platformId} onChange={(e) => setDraft((d) => ({ ...d, platformId: e.target.value }))}>
                    <option value="">— اختر —</option>
                    {platforms.map((p) => (
                      <option key={p.id} value={p.id}>{p.nameAr}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">رابط الكورس</label>
                  <input type="url" className="input" value={draft.url} onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))} placeholder="https://..." />
                </div>
                <div>
                  <label className="label">المدة (ساعات)</label>
                  <input type="number" className="input" value={draft.durationHrs} onChange={(e) => setDraft((d) => ({ ...d, durationHrs: e.target.value }))} />
                </div>
                <div>
                  <label className="label">المستوى</label>
                  <select className="input" value={draft.level} onChange={(e) => setDraft((d) => ({ ...d, level: e.target.value }))}>
                    <option value="">— اختر —</option>
                    <option value="beginner">مبتدئ</option>
                    <option value="intermediate">متوسط</option>
                    <option value="advanced">متقدم</option>
                  </select>
                </div>
                <div>
                  <label className="label">اللغة</label>
                  <select className="input" value={draft.language} onChange={(e) => setDraft((d) => ({ ...d, language: e.target.value }))}>
                    <option value="ar">عربي</option>
                    <option value="en">إنجليزي</option>
                  </select>
                </div>
                <div>
                  <label className="label">السعر</label>
                  <label className="flex items-center gap-2 mt-2.5 text-sm">
                    <input type="checkbox" checked={draft.isFree} onChange={(e) => setDraft((d) => ({ ...d, isFree: e.target.checked }))} />
                    كورس مجاني
                  </label>
                </div>
              </div>
              <div>
                <label className="label">المهارات المرتبطة</label>
                <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto rounded-xl border border-stone-200 p-3">
                  {skills.length === 0 && <span className="text-xs text-stone-400">لا توجد مهارات بعد. أضف مهارات أولاً.</span>}
                  {skills.map((s) => {
                    const active = draft.skillIds.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleSkill(s.id)}
                        className={`pill ${active ? "bg-brand-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
                      >
                        {s.nameAr}
                      </button>
                    );
                  })}
                </div>
              </div>
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">{error}</div>
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
