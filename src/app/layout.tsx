import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  display: "swap"
});

export const metadata: Metadata = {
  title: "مساري | منصة تحليل المهارات الوظيفية بالذكاء الاصطناعي",
  description:
    "منصة مساري تساعدك على معرفة الفجوة بين مهاراتك الحالية والمهارات المطلوبة لوظيفتك المستهدفة، مع رسم مسار تعلم احترافي مخصص.",
  keywords: ["مساري", "مهارات", "تطوير وظيفي", "السعودية", "الخليج", "تدريب", "ذكاء اصطناعي"],
  openGraph: {
    title: "مساري — مسارك المهني يبدأ من هنا",
    description: "تحليل ذكي لفجوة مهاراتك مع مسار تعلم مخصص",
    type: "website",
    locale: "ar_SA"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="bg-mesh min-h-screen">{children}</body>
    </html>
  );
}
