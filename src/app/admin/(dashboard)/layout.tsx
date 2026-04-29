import { Sidebar } from "./Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <Sidebar />
      <main className="md:mr-64 p-4 md:p-8 animate-fade-in">{children}</main>
    </div>
  );
}
