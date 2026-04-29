"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";

type Skill = { id: string; nameAr: string };
type JobSkill = { skillId: string; nameAr: string; importance: number };
type Row = {
  id: string;
  titleAr: string;
  titleEn: string | null;
  descriptionAr: string;
  category: string | null;
  level: string | null;
  skills: JobSkill[];
};

export function JobsAdmin({ rows, skills }: { rows: Row[]; skills: Skill[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    titleAr: "",
    titleEn: "",
    descriptionAr: "",
    category: "",
    level: "",
    skills: [] as { skillId: string; importance: number }[]
  });

  function blank() {
    setDraft({ titleAr: "", titleEn: "", descriptionAr: "", category: "", level: "", skills: [] });
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
      descriptionAr: r.descriptionAr,
      category: r.category ?? "",
      level: r.level ?? "",
      skills: r.skills.map((s) => ({ skillId: s.skillId, importance: s.importance }))
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

  function toggleSkill(id: string) {
    setDraft((d) => {
      const has = d.skills.find((s) => s.skillId === id);
      if (has) return { ...d, skills: d.skills.filter((s) => s.skillId !== id) };
      return { ...d, skills: [...d.skills, { skillId: id, importance: 3 }] };
    });
  }
  function setImportance(id: string, v: number) {
    setDraft((d) => ({
      ...d,
      skills: d.skills.map((s) => (s.skillId === id ? { ...s, importance: v } : s))
    }));
  }

  async function save() {
    setWorking(true);
    setError(null);
    try {
      const body = {
        titleAr: draft.titleAr,
        titleEn: draft.titleEn || null,
        descriptionAr: draft.descriptionAr,
        category: draft.category || null,
        level: draft.level || null,
        skills: draft.skills
      };
      const res = await fetch(
        editing ? `/api/proxy/api/jobs/${editing.id}` : "/api/proxy/api/jobs",
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
    if (!confirm("حذف هذه الوظيفة؟")) return;
    setWorking(true);
    try {
      const res = await fetch(`/api/proxy/api/jobs/${r.id}`, { method: "DELETE" });
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

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900">الوظائف</h1>
        <button onClick={startAdd} className="btn-primary !py-2 !px-4 text-sm">
          <Plus className="w-4 h-4" /> إضافة وظيفة
        </button>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-stone-600 text-xs">
              <tr>
                <th className="text-right p-3 font-semibold">المسمى</th>
                <th className="text-right p-3 font-semibold">التصنيف</th>
                <th className="text-right p-3 font-semibold">المستوى</th>
                <th className="text-right p-3 font-semibold">المهارات المطلوبة</th>
                <th className="p-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-500">لا توجد وظائف بعد</td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-stone-100 hover:bg-stone-50">
                  <td className="p-3 font-semibold text-stone-900 max-w-[260px]">{r.titleAr}</td>
                  <td className="p-3 text-stone-700">{r.category ?? "—"}</td>
                  <td className="p-3 text-stone-700">{r.level ?? "—"}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {r.skills.slice(0, 4).map((s) => (
                        <span key={s.skillId} className="pill bg-brand-50 text-brand-700">
                          {s.nameAr}
                          <span className="opacity-60 mr-1">{s.importance}</span>
                        </span>
                      ))}
                      {r.skills.length > 4 && (
                        <span className="pill bg-stone-100 text-stone-600">+{r.skills.length - 4}</span>
                      )}
                    </div>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-stone-100 sticky top-0 bg-white">
              <h2 className="text-lg font-bold">{editing ? "تعديل وظيفة" : "إضافة وظيفة"}</h2>
              <button onClick={cancel} className="p-2 rounded-lg hover:bg-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="label">المسمى الوظيفي بالعربية <span className="text-red-500">*</span></label>
                  <input className="input" value={draft.titleAr} onChange={(e) => setDraft((d) => ({ ...d, titleAr: e.target.value }))} />
                </div>
                <div>
                  <label className="label">المسمى الوظيفي بالإنجليزية</label>
                  <input className="input" value={draft.titleEn} onChange={(e) => setDraft((d) => ({ ...d, titleEn: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="label">التوصيف الوظيفي JD <span className="text-red-500">*</span></label>
                <textarea className="input min-h-28" value={draft.descriptionAr} onChange={(e) => setDraft((d) => ({ ...d, descriptionAr: e.target.value }))} />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="label">التصنيف</label>
                  <input className="input" value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))} placeholder="مثل: تقني، مالي، إداري" />
                </div>
                <div>
                  <label className="label">المستوى</label>
                  <select className="input" value={draft.level} onChange={(e) => setDraft((d) => ({ ...d, level: e.target.value }))}>
                    <option value="">— اختر —</option>
                    <option value="entry">مبتدئ (Entry)</option>
                    <option value="mid">متوسط (Mid)</option>
                    <option value="senior">متقدم (Senior)</option>
                    <option value="lead">قيادي (Lead)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">المهارات المطلوبة وأهميتها (1-5)</label>
                <div className="space-y-2 max-h-72 overflow-y-auto rounded-xl border border-stone-200 p-3">
                  {skills.length === 0 && (
                    <p className="text-xs text-stone-500">لا توجد مهارات بعد. أضف مهارات أولاً.</p>
                  )}
                  {skills.map((s) => {
                    const selected = draft.skills.find((x) => x.skillId === s.id);
                    return (
                      <div key={s.id} className="flex items-center justify-between gap-3 py-1.5 border-b border-stone-100 last:border-b-0">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!selected}
                            onChange={() => toggleSkill(s.id)}
                          />
                          {s.nameAr}
                        </label>
                        {selected && (
                          <select
                            className="text-xs rounded-lg border border-stone-200 px-2 py-1"
                            value={selected.importance}
                            onChange={(e) => setImportance(s.id, Number(e.target.value))}
                          >
                            {[1, 2, 3, 4, 5].map((n) => (
                              <option key={n} value={n}>أهمية {n}</option>
                            ))}
                          </select>
                        )}
                      </div>
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
