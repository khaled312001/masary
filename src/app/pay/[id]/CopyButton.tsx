"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("انسخ القيمة:", value);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label || "نسخ"}
      className="inline-flex items-center justify-center w-7 h-7 rounded-md text-stone-500 hover:text-brand-700 hover:bg-brand-50 transition shrink-0"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}
