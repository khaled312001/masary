import { apiServerSafe } from "@/lib/api";
import { SettingsForm } from "./SettingsForm";
import { Settings as SettingsIcon, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

type SettingMap = Record<string, { configured: boolean; preview: string | null; updatedAt: string | null }>;

export default async function SettingsPage() {
  const { data, error } = await apiServerSafe<SettingMap>("/api/settings");
  const settings = data ?? {};

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-brand-600" />
          الإعدادات
        </h1>
        <p className="text-stone-600 mt-1">إدارة المفاتيح والإعدادات السرية للمنصة</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-bold">تعذر تحميل الإعدادات</div>
            <p className="opacity-80 mt-1">{error}</p>
          </div>
        </div>
      )}

      <SettingsForm
        settingKey="ANTHROPIC_API_KEY"
        title="مفتاح Claude AI"
        description="مفتاح API من Anthropic لتشغيل التحليل الذكي. احصل عليه من console.anthropic.com"
        placeholder="sk-ant-api03-..."
        current={settings.ANTHROPIC_API_KEY}
      />
    </div>
  );
}
