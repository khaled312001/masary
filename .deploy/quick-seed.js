// Lightweight seed using createMany (one query per table) to avoid Prisma's
// tokio panics on Hostinger's restricted environment.
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const SKILLS = [
  "التواصل الفعّال","العمل ضمن فريق","حل المشكلات","التفكير التحليلي","إدارة الوقت",
  "اللغة الإنجليزية","Microsoft Excel","Microsoft PowerPoint","Microsoft Word","Power BI",
  "Tableau","SQL","Python","Pandas","تحليل البيانات","ذكاء أعمال","إدارة المشاريع",
  "PMP","Agile / Scrum","إدارة المخاطر","التحليل المالي","المحاسبة","إعداد الميزانيات",
  "IFRS","الموارد البشرية","التوظيف والاستقطاب","تطوير أنظمة الأداء","خدمة العملاء",
  "المبيعات","التسويق الرقمي","Google Ads","Meta Ads","تحسين محركات البحث SEO",
  "كتابة المحتوى","تصميم الجرافيك","Adobe Photoshop","Adobe Illustrator","Figma",
  "تجربة المستخدم UX","واجهة المستخدم UI","HTML","CSS","JavaScript","TypeScript",
  "React","Next.js","Node.js","REST APIs","Git & GitHub","Docker","AWS","Azure",
  "Linux","أمن المعلومات","Cybersecurity Fundamentals","تعلّم الآلة","الذكاء الاصطناعي",
  "ChatGPT للأعمال","إعداد التقارير","إدارة الجودة","السلامة المهنية HSE"
];

const COMPANIES = [
  ["أرامكو السعودية","Saudi Aramco","طاقة وبترول"],
  ["سابك","SABIC","بتروكيماويات"],
  ["معادن","Ma'aden","تعدين"],
  ["مدن","MODON","صناعي"],
  ["مصرف الراجحي","Al Rajhi Bank","بنوك"],
  ["البنك الأهلي السعودي","SNB","بنوك"],
  ["stc","stc","اتصالات"],
  ["نيوم","NEOM","مشاريع كبرى"],
  ["البحر الأحمر العالمية","Red Sea Global","سياحة"],
  ["الخطوط السعودية","Saudia","طيران"],
  ["صندوق الاستثمارات العامة","PIF","استثمار"],
  ["روشن","ROSHN","تطوير عقاري"]
];

const PLATFORMS = [
  ["إدراك","Edraak","https://www.edraak.org"],
  ["رواق","Rwaq","https://www.rwaq.org"],
  ["أكاديمية طويق","Tuwaiq Academy","https://tuwaiq.edu.sa"],
  ["مهارة","Maharah","https://www.doroob.sa"],
  ["كورسيرا","Coursera","https://www.coursera.org"],
  ["LinkedIn Learning","LinkedIn Learning","https://www.linkedin.com/learning"],
  ["Udemy","Udemy","https://www.udemy.com"]
];

const JOBS = [
  ["محلل بيانات","Data Analyst","يحلل البيانات لاتخاذ قرارات أعمال","تقني","Mid"],
  ["مهندس بيانات","Data Engineer","يبني خطوط نقل ومعالجة البيانات","تقني","Mid"],
  ["مطور ويب","Web Developer","يبني تطبيقات الويب باستخدام React وNext.js","تقني","Junior"],
  ["مطور Full-Stack","Full-Stack Developer","يطور الواجهة والباك إند","تقني","Mid"],
  ["مهندس ذكاء اصطناعي","AI Engineer","يبني نماذج ML/AI ويدمجها","تقني","Senior"],
  ["أخصائي تسويق رقمي","Digital Marketing Specialist","يدير حملات إعلانية رقمية","تسويق","Mid"],
  ["مدير منتج","Product Manager","يقود تطوير المنتج من البحث للإطلاق","إدارة","Senior"],
  ["محاسب","Accountant","يعد التقارير المالية ويتابع القيود","مالي","Mid"],
  ["محلل مالي","Financial Analyst","يحلل البيانات المالية ويعد التوقعات","مالي","Mid"],
  ["أخصائي موارد بشرية","HR Specialist","يدير التوظيف والاستقطاب","موارد بشرية","Junior"],
  ["مصمم UX/UI","UX/UI Designer","يصمم تجربة وواجهة المستخدم","تصميم","Mid"],
  ["مدير مشاريع","Project Manager","يقود تنفيذ المشاريع","إدارة","Senior"]
];

async function main() {
  console.log("seeding skills...");
  await prisma.skill.createMany({
    data: SKILLS.map((nameAr) => ({ nameAr })),
    skipDuplicates: true
  });
  const skillCount = await prisma.skill.count();
  console.log("skills:", skillCount);

  console.log("seeding companies...");
  await prisma.company.createMany({
    data: COMPANIES.map(([nameAr, nameEn, industry]) => ({ nameAr, nameEn, industry })),
    skipDuplicates: true
  });
  const companyCount = await prisma.company.count();
  console.log("companies:", companyCount);

  console.log("seeding platforms...");
  await prisma.platform.createMany({
    data: PLATFORMS.map(([nameAr, nameEn, website]) => ({ nameAr, nameEn, website })),
    skipDuplicates: true
  });
  const platformCount = await prisma.platform.count();
  console.log("platforms:", platformCount);

  console.log("seeding jobs...");
  await prisma.job.createMany({
    data: JOBS.map(([titleAr, titleEn, descriptionAr, category, level]) => ({
      titleAr, titleEn, descriptionAr, category, level
    })),
    skipDuplicates: true
  });
  const jobCount = await prisma.job.count();
  console.log("jobs:", jobCount);

  await prisma.$disconnect();
  console.log("DONE");
}

main().catch((e) => {
  console.error("seed failed:", e);
  process.exit(1);
});
