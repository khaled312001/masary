# دليل النشر — Masary

## النشر على Vercel (3 خطوات)

### 1. أنشئ قاعدة بيانات Postgres مجانية

اختر واحدة من:

**أ) Neon (الأسرع — موصى به)**
1. اذهب إلى [neon.tech](https://neon.tech) وسجل دخول.
2. أنشئ Project جديد → اختر منطقة قريبة (مثل Frankfurt).
3. انسخ `Connection String` (شكله `postgresql://...?sslmode=require`).

**ب) Vercel Postgres**
1. في Vercel Dashboard → Storage → Create → Postgres.
2. اربطها بمشروعك تلقائياً.

### 2. احصل على مفتاح Claude API

1. اذهب إلى [console.anthropic.com](https://console.anthropic.com).
2. API Keys → Create Key → انسخ المفتاح (يبدأ بـ `sk-ant-...`).

### 3. انشر على Vercel

```bash
# 1. ارفع المشروع على GitHub
git init
git add .
git commit -m "feat: initial masary platform"
git remote add origin https://github.com/USERNAME/masary.git
git push -u origin main

# 2. ادخل vercel.com → New Project → استورد الـ repo
# 3. أضف Environment Variables التالية:
```

| المتغير | القيمة |
|---------|--------|
| `DATABASE_URL` | رابط Postgres من الخطوة 1 |
| `ANTHROPIC_API_KEY` | مفتاح Claude من الخطوة 2 |
| `ADMIN_EMAIL` | بريد المشرف (مثل `admin@masary.sa`) |
| `ADMIN_PASSWORD` | كلمة مرور قوية للأدمن |
| `AUTH_SECRET` | سلسلة عشوائية طويلة (32+ حرف) |

> 💡 لتوليد `AUTH_SECRET`: شغّل في PowerShell:
> ```powershell
> -join ((1..48) | ForEach-Object { [char](Get-Random -Min 33 -Max 127) })
> ```

### 4. هيّئ قاعدة البيانات (مرة واحدة فقط)

**من جهازك المحلي** بنفس `DATABASE_URL`:

```bash
# أنشئ ملف .env محلياً وضع فيه DATABASE_URL
npx prisma db push
npm run db:seed
```

سيتم إنشاء الجداول وإضافة البيانات الأولية:
- 12 شركة سعودية (أرامكو، معادن، الراجحي، نيوم...)
- 60+ مهارة شاملة
- 9 منصات تعلم
- 16 كورس
- 10 وظائف نموذجية

### 5. اختبر المنصة

1. افتح رابط Vercel الخاص بمشروعك.
2. اضغط "ابدأ التحليل" واملأ النموذج.
3. سيظهر التقرير خلال ~10-30 ثانية.
4. ادخل لوحة التحكم: `your-domain.com/admin/login`

---

## استكشاف الأخطاء

### "تعذر إنشاء التقرير"
- تحقق من `ANTHROPIC_API_KEY` صحيح وفيه رصيد.
- راجع Vercel Logs للتفاصيل.

### "غير مصرّح" في لوحة الإدارة
- تحقق من `ADMIN_EMAIL` و `ADMIN_PASSWORD` في Vercel.
- تأكد من `AUTH_SECRET` موجود وطوله 16+ حرف.

### Prisma Errors
- شغّل `npx prisma db push` مرة أخرى.
- تأكد أن `DATABASE_URL` يحتوي `?sslmode=require`.

---

## ربط دومين مخصص

في Vercel → Project → Settings → Domains → أضف الدومين الخاص بك.
