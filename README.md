# مساري — Frontend (Next.js)

واجهة منصة "مساري" المبنية بـ Next.js 14. لا تتصل بقاعدة البيانات مباشرة — كل البيانات تأتي من الباك إند.

## الباك إند منفصل

الباك إند موجود في **ريبو git مستقل** على المسار: `e:\masary-backend\`

- **الباك إند:** Express + Prisma + MySQL + Claude AI
- **الفرونت إند:** Next.js 14 (هذا الريبو) — UI فقط

## التشغيل المحلي

```bash
# 1. شغّل الباك إند أولاً (في ريبو منفصل)
cd ../masary-backend
npm install
npm run dev   # على http://localhost:4000

# 2. هنا في الفرونت إند
cp .env.example .env
# عدّل API_URL ليشير للباك إند
npm install
npm run dev   # على http://localhost:3000
```

## متغيرات البيئة

| المتغير | القيمة |
|---------|--------|
| `API_URL` | `http://localhost:4000` (server-side fetch) |
| `NEXT_PUBLIC_API_URL` | نفس الرابط (للمتصفح) |
| `AUTH_SECRET` | **يجب أن تكون نفس قيمة AUTH_SECRET في الباك إند** |

## النشر على Vercel

1. ادفع الريبو على GitHub.
2. أنشئ Project في Vercel من الريبو.
3. أضف Environment Variables:
   - `API_URL` = `https://api.masary.sa` (رابط الباك إند المنشور)
   - `NEXT_PUBLIC_API_URL` = نفس الرابط
   - `AUTH_SECRET` = نفس قيمة الباك إند
4. Deploy.

## بنية الكود

```
src/
├── app/
│   ├── page.tsx                  # الصفحة الرئيسية
│   ├── admin/
│   │   ├── login/                # تسجيل دخول الإدارة
│   │   └── (dashboard)/          # لوحة التحكم (محمية)
│   ├── report/[id]/              # عرض التقرير العام
│   └── api/
│       ├── admin/login           # يستدعي الباك إند ويحفظ التوكن في cookie
│       ├── admin/logout          # يحذف التوكن
│       └── proxy/[...path]       # proxy للباك إند مع توكن من cookie
├── components/                    # UI
├── lib/api.ts                     # API client (يستهلك الباك إند)
├── types/report.ts                # أنواع التقرير
└── middleware.ts                  # حماية مسارات /admin
```

## كيف تعمل المصادقة

1. المستخدم يسجل دخوله من `/admin/login`
2. Next.js يستدعي `POST /api/admin/login` (route handler هنا)
3. الـ route handler يستدعي الباك إند: `POST {API_URL}/api/auth/login`
4. الباك إند يرجع `token` (JWT)
5. الفرونت إند يحفظ الـ token في **httpOnly cookie**
6. أي طلب لـ `/api/proxy/...` يقرأ الـ token من الـ cookie ويُعيد توجيهه للباك إند مع `Authorization: Bearer ...`
7. middleware يتحقق من صلاحية الـ token قبل السماح بالوصول لـ `/admin/*`
