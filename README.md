# مساري — Masary

منصة ذكية لتحليل فجوة المهارات الوظيفية بالذكاء الاصطناعي، موجهة للسوق السعودي والخليجي.

تتيح للمستخدم إدخال المسمى الوظيفي المستهدف ومهاراته الحالية، فتُصدر له تقريراً مفصلاً بالفجوة بين مهاراته والمتطلبات، مع رسم مسار تعلم مخصص ودورات مقترحة بروابطها.

## المزايا

- 🤖 تحليل بالذكاء الاصطناعي (Claude Sonnet 4.6)
- 🎯 تقرير مفصل بنسبة التطابق والفجوات والمسار التعليمي
- 🧠 لوحة تحكم كاملة للمشرفين لإدارة الوظائف، المهارات، الكورسات، الشركات، والمنصات
- 🌐 واجهة عربية احترافية RTL مناسبة للهاتف
- 🚀 جاهز للنشر على Vercel
- 🗄️ قاعدة بيانات PostgreSQL عبر Prisma

## التشغيل المحلي

### 1. تثبيت الاعتماديات

```bash
npm install
```

### 2. إعداد ملف البيئة

انسخ `.env.example` إلى `.env` وعبّئ القيم:

```env
DATABASE_URL="postgresql://user:password@host:5432/masary?sslmode=require"
ANTHROPIC_API_KEY="sk-ant-..."
ADMIN_EMAIL="admin@masary.sa"
ADMIN_PASSWORD="ChangeMe!2026"
AUTH_SECRET="please-replace-with-a-long-random-32-byte-secret"
```

> 💡 احصل على قاعدة بيانات Postgres مجانية من [Neon](https://neon.tech) أو [Vercel Postgres](https://vercel.com/storage/postgres).

### 3. إنشاء جداول قاعدة البيانات

```bash
npm run db:push
```

### 4. تعبئة البيانات الأولية (شركات سعودية + كورسات + مهارات + وظائف)

```bash
npm run db:seed
```

### 5. تشغيل المنصة

```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

- **الواجهة العامة:** `/`
- **نموذج التحليل:** `/analyze`
- **لوحة التحكم:** `/admin/login`

## النشر على Vercel

### الطريقة السريعة

1. ارفع المشروع على GitHub.
2. ادخل [vercel.com](https://vercel.com) وأنشئ مشروعاً جديداً مرتبطاً بالـ repo.
3. أضف متغيرات البيئة في إعدادات Vercel:
   - `DATABASE_URL`
   - `ANTHROPIC_API_KEY`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `AUTH_SECRET`
4. اضغط Deploy. سيتم تنفيذ `prisma generate && next build` تلقائياً.

### بعد أول نشر

شغّل Migration والSeed مرة واحدة محلياً (مع نفس DATABASE_URL):

```bash
npm run db:push
npm run db:seed
```

أو من خلال Vercel CLI / Vercel Postgres Dashboard.

## الاعتماديات الرئيسية

| الفئة | المكتبة |
|------|---------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Prisma + PostgreSQL |
| AI | @anthropic-ai/sdk (Claude Sonnet 4.6) |
| Auth | jose (JWT) للأدمن |
| Validation | Zod |
| Icons | lucide-react |

## هيكل المشروع

```
src/
├── app/
│   ├── page.tsx                 # الصفحة الرئيسية
│   ├── analyze/                 # نموذج التحليل
│   ├── report/[id]/             # عرض التقرير
│   ├── admin/                   # لوحة التحكم
│   │   ├── jobs/
│   │   ├── skills/
│   │   ├── courses/
│   │   ├── companies/
│   │   ├── platforms/
│   │   └── reports/
│   └── api/
│       ├── analyze/             # تحليل بالذكاء الاصطناعي
│       └── admin/               # CRUD APIs
├── components/                   # مكونات UI
├── lib/                          # ai, prisma, auth helpers
└── middleware.ts                 # حماية مسارات /admin

prisma/
├── schema.prisma                 # مخطط القاعدة
└── seed.ts                       # بيانات أولية للسوق السعودي
```

## ملاحظات أمنية

- لا تشارك `AUTH_SECRET` أو `ADMIN_PASSWORD`.
- في الإنتاج، استبدل `ADMIN_PASSWORD` بكلمة قوية.
- تأكد أن `DATABASE_URL` يستخدم SSL (`sslmode=require`).

## الدعم

لأي ملاحظات أو تطوير إضافي، تواصل مع فريق التطوير.

---

© مساري — مسارك المهني يبدأ من هنا
