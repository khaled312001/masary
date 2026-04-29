export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-600/30 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 32 32" fill="none" className="w-2/3 h-2/3 text-white">
          <path
            d="M4 24 L4 12 L10 18 L16 8 L22 18 L28 12 L28 24"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="28" cy="12" r="2.5" fill="currentColor" />
        </svg>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-xl font-extrabold text-brand-800 tracking-tight">مساري</span>
        <span className="text-[10px] font-medium text-stone-500 -mt-0.5">masary</span>
      </div>
    </div>
  );
}
