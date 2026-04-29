"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, X } from "lucide-react";

export function ContentProtection({ active }: { active: boolean }) {
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;

    let warningTimer: ReturnType<typeof setTimeout> | null = null;

    const showWarning = (msg: string) => {
      setWarning(msg);
      if (warningTimer) clearTimeout(warningTimer);
      warningTimer = setTimeout(() => setWarning(null), 3500);
    };

    // Add CSS class to body to enable @media print rules and disable selection
    document.body.classList.add("locked-content");

    const onKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const k = e.key.toLowerCase();

      // Print / Save / Copy / Select-all / View source
      if (ctrl && ["p", "s", "c", "x", "a", "u"].includes(k)) {
        e.preventDefault();
        e.stopPropagation();
        showWarning("هذا الإجراء مقفل. فعّل النسخة الكاملة للتنزيل.");
        return false;
      }

      // Print Screen
      if (e.key === "PrintScreen") {
        e.preventDefault();
        navigator.clipboard?.writeText?.("").catch(() => {});
        showWarning("لقطة الشاشة غير مسموح بها على المحتوى المحمي.");
        return false;
      }

      // DevTools shortcuts: F12, Ctrl+Shift+I/J/C, Ctrl+U
      if (
        e.key === "F12" ||
        (ctrl && e.shiftKey && ["i", "j", "c"].includes(k))
      ) {
        e.preventDefault();
        e.stopPropagation();
        showWarning("أدوات المطوّر مقفولة على هذه الصفحة.");
        return false;
      }
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showWarning("القائمة السياقية مقفلة.");
      return false;
    };

    const onCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      e.clipboardData?.setData(
        "text/plain",
        "محتوى محمي من منصة مساري — فعّل النسخة الكاملة للتنزيل."
      );
      showWarning("النسخ مقفل. فعّل النسخة الكاملة.");
    };

    const onCut = (e: ClipboardEvent) => {
      e.preventDefault();
      showWarning("القص مقفل.");
    };

    const onSelectStart = (e: Event) => {
      e.preventDefault();
    };

    const onDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // Hide content visually when print is invoked (most browsers)
    const onBeforePrint = () => {
      showWarning("الطباعة مقفلة. فعّل النسخة الكاملة لتنزيل التقرير.");
    };

    // Detect when window loses focus (often screenshot tools)
    let blurTimer: ReturnType<typeof setTimeout> | null = null;
    const onBlur = () => {
      // Add slight blur to make screenshots less useful
      blurTimer = setTimeout(() => {
        document.body.classList.add("content-blurred");
      }, 100);
    };
    const onFocus = () => {
      if (blurTimer) clearTimeout(blurTimer);
      document.body.classList.remove("content-blurred");
    };

    document.addEventListener("keydown", onKeyDown, { capture: true });
    document.addEventListener("contextmenu", onContextMenu, { capture: true });
    document.addEventListener("copy", onCopy);
    document.addEventListener("cut", onCut);
    document.addEventListener("selectstart", onSelectStart);
    document.addEventListener("dragstart", onDragStart);
    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      if (warningTimer) clearTimeout(warningTimer);
      if (blurTimer) clearTimeout(blurTimer);
      document.body.classList.remove("locked-content");
      document.body.classList.remove("content-blurred");
      document.removeEventListener("keydown", onKeyDown, { capture: true } as any);
      document.removeEventListener("contextmenu", onContextMenu, { capture: true } as any);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("cut", onCut);
      document.removeEventListener("selectstart", onSelectStart);
      document.removeEventListener("dragstart", onDragStart);
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, [active]);

  if (!active || !warning) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-fade-in pointer-events-auto">
      <div className="rounded-xl bg-stone-900/95 backdrop-blur text-white px-4 py-3 shadow-2xl border border-stone-700 flex items-center gap-3 max-w-sm">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-4 h-4 text-amber-300" />
        </div>
        <div className="text-sm flex-1">{warning}</div>
        <button
          onClick={() => setWarning(null)}
          className="text-white/50 hover:text-white"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
