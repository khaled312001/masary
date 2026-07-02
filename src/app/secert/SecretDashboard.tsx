"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SecretData, SiteEntry } from "@/lib/secret-auth";
import {
  Server,
  Globe,
  Shield,
  Mail,
  Copy,
  Check,
  ExternalLink,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
  Database,
  Code2
} from "lucide-react";

export function SecretDashboard({ data }: { data: SecretData }) {
  const router = useRouter();
  const [tab, setTab] = useState<string>("hosting");
  const [revealAll, setRevealAll] = useState(false);

  async function logout() {
    await fetch("/api/secret/logout", { method: "POST" }).catch(() => {});
    router.replace("/secert/login");
    router.refresh();
  }

  const tabs = [
    { key: "hosting", label: "الاستضافة", icon: Server },
    ...data.sites.map((s) => ({ key: s.key, label: s.name, icon: Globe }))
  ];

  return (
    <main className="min-h-screen bg-stone-950 text-stone-200">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
              <KeyRound className="w-6 h-6 text-amber-400" />
              مرجع بيانات المواقع
            </h1>
            <p className="text-sm text-stone-400 mt-1">
              جميع بيانات الدخول للمواقع الأربعة على السيرفر الحالي
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRevealAll((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl bg-stone-800 hover:bg-stone-700 px-3 py-2 text-sm font-semibold transition"
            >
              {revealAll ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {revealAll ? "إخفاء الكل" : "إظهار الكل"}
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-900 text-red-300 px-3 py-2 text-sm font-semibold transition"
            >
              <LogOut className="w-4 h-4" />
              خروج
            </button>
          </div>
        </div>

        {/* Source-code / DB note */}
        <div className="mt-5 rounded-2xl border border-amber-900/50 bg-amber-950/20 p-4 flex items-start gap-3">
          <div className="flex gap-1.5 shrink-0 mt-0.5">
            <Code2 className="w-5 h-5 text-amber-400" />
            <Database className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-sm text-amber-200/90 leading-relaxed">
            {data.hosting.note}
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold whitespace-nowrap transition ${
                  active
                    ? "bg-amber-500 text-stone-900"
                    : "bg-stone-900 border border-stone-800 text-stone-300 hover:bg-stone-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="mt-5">
          {tab === "hosting" ? (
            <HostingTab data={data} reveal={revealAll} />
          ) : (
            <SiteTab site={data.sites.find((s) => s.key === tab)!} reveal={revealAll} />
          )}
        </div>

        <p className="mt-8 text-center text-[11px] text-stone-600">
          هذه الصفحة سرية ومحمية بكلمة مرور — لا تشاركها مع أي شخص.
        </p>
      </div>
    </main>
  );
}

function HostingTab({ data, reveal }: { data: SecretData; reveal: boolean }) {
  const h = data.hosting;
  return (
    <Card title={`حساب ${h.provider}`} icon={Server}>
      <LinkRow label="رابط لوحة التحكم" url={h.loginUrl} />
      <CredRow label="البريد / اسم المستخدم" value={h.email} reveal={reveal} sensitive={false} />
      <CredRow label="كلمة المرور" value={h.password} reveal={reveal} sensitive />
      <div className="pt-2">
        <LinkRow label="بريد هوستنجر (Webmail)" url={h.webmailUrl} />
      </div>
    </Card>
  );
}

function SiteTab({ site, reveal }: { site: SiteEntry; reveal: boolean }) {
  return (
    <div className="space-y-4">
      <Card title={site.name} icon={Globe} subtitle={site.domain}>
        <LinkRow label="رابط الموقع" url={site.url} />
        {site.notes && <p className="text-xs text-stone-400 pt-1">{site.notes}</p>}
      </Card>

      {site.admin && (
        <Card title="لوحة تحكم الأدمن" icon={Shield}>
          <LinkRow label="رابط الدخول" url={site.admin.url} />
          <CredRow label="البريد / المستخدم" value={site.admin.email} reveal={reveal} sensitive={false} />
          <CredRow label="كلمة المرور" value={site.admin.password} reveal={reveal} sensitive />
        </Card>
      )}

      {site.email && (
        <Card title="البريد الإلكتروني" icon={Mail}>
          <CredRow label="البريد" value={site.email.address} reveal={reveal} sensitive={false} />
          <CredRow label="كلمة مرور البريد" value={site.email.password} reveal={reveal} sensitive />
          <div className="pt-2">
            <LinkRow label="رابط الويب ميل" url={site.email.webmail} />
          </div>
        </Card>
      )}
    </div>
  );
}

function Card({
  title,
  subtitle,
  icon: Icon,
  children
}: {
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-900 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-lg bg-stone-800 flex items-center justify-center">
          <Icon className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="font-bold text-white">{title}</h2>
          {subtitle && <div className="text-xs text-stone-500" dir="ltr">{subtitle}</div>}
        </div>
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function LinkRow({ label, url }: { label: string; url: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-stone-950/50 border border-stone-800 px-3 py-2.5">
      <span className="text-xs text-stone-500 shrink-0">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          dir="ltr"
          className="text-sm text-sky-400 hover:underline truncate"
          title={url}
        >
          {url.replace(/^https?:\/\//, "")}
        </a>
        <a href={url} target="_blank" rel="noreferrer" className="text-stone-500 hover:text-sky-400 shrink-0">
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <CopyBtn value={url} />
      </div>
    </div>
  );
}

function CredRow({
  label,
  value,
  reveal,
  sensitive
}: {
  label: string;
  value: string;
  reveal: boolean;
  sensitive: boolean;
}) {
  const [show, setShow] = useState(false);
  const visible = show || reveal || !sensitive;
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-stone-950/50 border border-stone-800 px-3 py-2.5">
      <span className="text-xs text-stone-500 shrink-0">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span
          dir="ltr"
          className={`text-sm font-mono truncate ${sensitive ? "text-amber-300" : "text-stone-200"}`}
          title={visible ? value : ""}
        >
          {visible ? value : "•".repeat(Math.min(14, value.length))}
        </span>
        {sensitive && (
          <button
            onClick={() => setShow((v) => !v)}
            className="text-stone-500 hover:text-amber-300 shrink-0"
            aria-label={visible ? "إخفاء" : "إظهار"}
          >
            {visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        )}
        <CopyBtn value={value} />
      </div>
    </div>
  );
}

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  }
  return (
    <button onClick={copy} className="text-stone-500 hover:text-green-400 shrink-0" aria-label="نسخ">
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}
