# دليل النشر — Masary

## 🟢 الحالة الحالية

- ✅ قاعدة البيانات MySQL على Hostinger مرفوعة وفيها البيانات الأولية
- ✅ البناء يمر بنجاح (no errors)
- ✅ المنصة محمية بالكامل — التحليل من الإدارة فقط

## النشر على Vercel (3 خطوات)

### 1. ارفع المشروع على GitHub

```bash
git add .
git commit -m "feat: switch to MySQL + admin-only analysis"
git push
```

### 2. أضف متغيرات البيئة في Vercel

ادخل **Project Settings → Environment Variables** وضع التالي:

| المتغير | القيمة |
|---------|--------|
| `DATABASE_URL` | `mysql://u790947786_ai:Q%21vFxwpIuIJ1@srv2000.hstgr.io:3306/u790947786_ai` |
| `ANTHROPIC_API_KEY` | مفتاحك من [console.anthropic.com](https://console.anthropic.com) |
| `ADMIN_EMAIL` | `admin@masary.sa` (أو بريدك) |
| `ADMIN_PASSWORD` | كلمة مرور قوية (مثل: `Masary@2026!`) |
| `AUTH_SECRET` | سلسلة عشوائية (32+ حرف) |

> ⚠️ **مهم:** كلمة مرور MySQL تحتوي على `!` لذا يجب ترميزها كـ `%21` في رابط الاتصال (تم بالفعل أعلاه).
>
> ⚠️ تأكد من تفعيل **"Any Host"** في إعدادات Remote MySQL على Hostinger ليتمكن Vercel من الاتصال.

### 3. أعد النشر

اضغط **Redeploy** في Vercel — البناء سيمر مباشرة (الجداول والبيانات موجودة).

---

## بعد النشر

### اختبار المنصة

1. افتح رابط Vercel.
2. اضغط **"دخول الإدارة"** أعلى الصفحة الرئيسية.
3. سجّل الدخول بـ `ADMIN_EMAIL` و `ADMIN_PASSWORD`.
4. من لوحة القيادة، اضغط **"تحليل جديد للمستخدم"**.
5. عبّئ بيانات المستخدم — سيظهر التقرير خلال 10-30 ثانية.
6. شارك رابط التقرير (`/report/<id>`) مع المستخدم النهائي.

### إدارة البيانات

- **الوظائف، المهارات، الكورسات، الشركات، المنصات** — كلها قابلة للتعديل من لوحة التحكم.
- البيانات الأولية تشمل 12 شركة سعودية، 61 مهارة، 16 كورس، 10 وظائف، 9 منصات تعلم.

---

## التشغيل المحلي

```bash
# 1. ضع قيم .env (DATABASE_URL وANTHROPIC_API_KEY ...إلخ)
cp .env.example .env

# 2. ثبّت الاعتماديات
npm install

# 3. (اختياري — تم بالفعل) ارفع الجداول وعبّئ البيانات
npx prisma db push
npm run db:seed

# 4. شغّل
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

---

## بيانات الاتصال بالقاعدة

```
Host: srv2000.hstgr.io
Port: 3306
Database: u790947786_ai
User: u790947786_ai
Password: Q!vFxwpIuIJ1
```

في رابط Prisma:
```
mysql://u790947786_ai:Q%21vFxwpIuIJ1@srv2000.hstgr.io:3306/u790947786_ai
```

---

## استكشاف الأخطاء

### "Can't reach database server"
- تأكد من تفعيل **Any Host** في Hostinger → Databases → Remote MySQL.
- أو أضف IP السيرفر الذي يحاول الاتصال.

### "تعذر إنشاء التقرير"
- تحقق من `ANTHROPIC_API_KEY` صحيح وفيه رصيد.
- راجع Vercel Logs للتفاصيل.

### "غير مصرّح" في API
- تحقق من `ADMIN_EMAIL` و `ADMIN_PASSWORD` في Vercel.
- تأكد من `AUTH_SECRET` موجود وطوله 16+ حرف.
