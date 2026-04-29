export function Footer() {
  return (
    <footer className="border-t border-stone-100 bg-white/60 py-8 mt-16 no-print">
      <div className="mx-auto max-w-7xl px-4 md:px-8 text-center text-sm text-stone-500">
        <p className="font-medium">مساري — مسارك المهني يبدأ من هنا</p>
        <p className="mt-1">© {new Date().getFullYear()} جميع الحقوق محفوظة</p>
      </div>
    </footer>
  );
}
