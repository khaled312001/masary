import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SKILL_TRANSLATIONS: Record<string, { en: string; category: string }> = {
  "التواصل الفعّال": { en: "Effective Communication", category: "مهارات شخصية" },
  "العمل ضمن فريق": { en: "Teamwork", category: "مهارات شخصية" },
  "حل المشكلات": { en: "Problem Solving", category: "مهارات شخصية" },
  "التفكير التحليلي": { en: "Analytical Thinking", category: "مهارات شخصية" },
  "إدارة الوقت": { en: "Time Management", category: "مهارات شخصية" },
  "اللغة الإنجليزية": { en: "English Language", category: "لغات" },

  "Microsoft Excel": { en: "Microsoft Excel", category: "أدوات مكتبية" },
  "Microsoft PowerPoint": { en: "Microsoft PowerPoint", category: "أدوات مكتبية" },
  "Microsoft Word": { en: "Microsoft Word", category: "أدوات مكتبية" },
  "Power BI": { en: "Power BI", category: "تحليل بيانات" },
  "Tableau": { en: "Tableau", category: "تحليل بيانات" },
  "SQL": { en: "SQL", category: "تحليل بيانات" },
  "Python": { en: "Python", category: "تطوير وبرمجة" },
  "Pandas": { en: "Pandas", category: "تحليل بيانات" },
  "تحليل البيانات": { en: "Data Analysis", category: "تحليل بيانات" },
  "ذكاء أعمال": { en: "Business Intelligence", category: "تحليل بيانات" },

  "إدارة المشاريع": { en: "Project Management", category: "إدارة" },
  "PMP": { en: "Project Management Professional (PMP)", category: "إدارة" },
  "Agile / Scrum": { en: "Agile / Scrum", category: "إدارة" },
  "إدارة المخاطر": { en: "Risk Management", category: "إدارة" },
  "إدارة الجودة": { en: "Quality Management", category: "إدارة" },

  "التحليل المالي": { en: "Financial Analysis", category: "مالية ومحاسبة" },
  "المحاسبة": { en: "Accounting", category: "مالية ومحاسبة" },
  "إعداد الميزانيات": { en: "Budgeting", category: "مالية ومحاسبة" },
  "IFRS": { en: "IFRS — International Financial Reporting Standards", category: "مالية ومحاسبة" },

  "الموارد البشرية": { en: "Human Resources", category: "موارد بشرية" },
  "التوظيف والاستقطاب": { en: "Recruitment & Talent Acquisition", category: "موارد بشرية" },
  "تطوير أنظمة الأداء": { en: "Performance Management Systems", category: "موارد بشرية" },

  "خدمة العملاء": { en: "Customer Service", category: "مبيعات وتسويق" },
  "المبيعات": { en: "Sales", category: "مبيعات وتسويق" },
  "التسويق الرقمي": { en: "Digital Marketing", category: "مبيعات وتسويق" },
  "Google Ads": { en: "Google Ads", category: "مبيعات وتسويق" },
  "Meta Ads": { en: "Meta (Facebook & Instagram) Ads", category: "مبيعات وتسويق" },
  "تحسين محركات البحث SEO": { en: "Search Engine Optimization (SEO)", category: "مبيعات وتسويق" },
  "كتابة المحتوى": { en: "Content Writing", category: "مبيعات وتسويق" },

  "تصميم الجرافيك": { en: "Graphic Design", category: "تصميم" },
  "Adobe Photoshop": { en: "Adobe Photoshop", category: "تصميم" },
  "Adobe Illustrator": { en: "Adobe Illustrator", category: "تصميم" },
  "Figma": { en: "Figma", category: "تصميم" },
  "تجربة المستخدم UX": { en: "User Experience (UX)", category: "تصميم" },
  "واجهة المستخدم UI": { en: "User Interface (UI)", category: "تصميم" },

  "HTML": { en: "HTML", category: "تطوير ويب" },
  "CSS": { en: "CSS", category: "تطوير ويب" },
  "JavaScript": { en: "JavaScript", category: "تطوير ويب" },
  "TypeScript": { en: "TypeScript", category: "تطوير ويب" },
  "React": { en: "React", category: "تطوير ويب" },
  "Next.js": { en: "Next.js", category: "تطوير ويب" },
  "Node.js": { en: "Node.js", category: "تطوير ويب" },
  "REST APIs": { en: "REST APIs", category: "تطوير ويب" },
  "Git & GitHub": { en: "Git & GitHub", category: "تطوير وبرمجة" },

  "Docker": { en: "Docker", category: "DevOps & Cloud" },
  "AWS": { en: "Amazon Web Services (AWS)", category: "DevOps & Cloud" },
  "Azure": { en: "Microsoft Azure", category: "DevOps & Cloud" },
  "Linux": { en: "Linux", category: "DevOps & Cloud" },

  "أمن المعلومات": { en: "Information Security", category: "أمن سيبراني" },
  "Cybersecurity Fundamentals": { en: "Cybersecurity Fundamentals", category: "أمن سيبراني" },

  "تعلّم الآلة": { en: "Machine Learning", category: "ذكاء اصطناعي" },
  "الذكاء الاصطناعي": { en: "Artificial Intelligence", category: "ذكاء اصطناعي" },
  "ChatGPT للأعمال": { en: "ChatGPT for Business", category: "ذكاء اصطناعي" },

  "إعداد التقارير": { en: "Report Writing", category: "مهارات شخصية" },
  "السلامة المهنية HSE": { en: "Health, Safety & Environment (HSE)", category: "جودة وسلامة" }
};

const COURSE_TRANSLATIONS: Record<string, string> = {
  "أساسيات تحليل البيانات": "Data Analysis Fundamentals",
  "Google Data Analytics": "Google Data Analytics",
  "Python for Everybody": "Python for Everybody",
  "أساسيات Power BI": "Power BI Fundamentals",
  "أساسيات تطوير الويب الحديث": "Modern Web Development Fundamentals",
  "إدارة المشاريع — تأسيس PMP": "Project Management — PMP Foundation",
  "Scrum Master أساسيات": "Scrum Master Fundamentals",
  "Excel للأعمال — متقدم": "Advanced Excel for Business",
  "Digital Marketing — Google": "Digital Marketing — Google",
  "أساسيات الموارد البشرية": "HR Fundamentals",
  "AWS Cloud Practitioner": "AWS Cloud Practitioner",
  "Cybersecurity Fundamentals": "Cybersecurity Fundamentals",
  "أساسيات الذكاء الاصطناعي للأعمال": "AI for Business Fundamentals",
  "تصميم تجربة المستخدم UX": "UX Design Specialization",
  "اللغة الإنجليزية للأعمال": "Business English",
  "أساسيات IFRS": "IFRS Fundamentals"
};

async function main() {
  console.log("🌐 Updating translations...");

  let skillsUpdated = 0;
  for (const [nameAr, { en, category }] of Object.entries(SKILL_TRANSLATIONS)) {
    const result = await prisma.skill.updateMany({
      where: { nameAr },
      data: { nameEn: en, category }
    });
    if (result.count > 0) skillsUpdated += result.count;
  }
  console.log(`✅ Skills updated: ${skillsUpdated}`);

  let coursesUpdated = 0;
  for (const [titleAr, titleEn] of Object.entries(COURSE_TRANSLATIONS)) {
    const result = await prisma.course.updateMany({
      where: { titleAr },
      data: { titleEn }
    });
    if (result.count > 0) coursesUpdated += result.count;
  }
  console.log(`✅ Courses updated: ${coursesUpdated}`);

  // Show counts of fully-translated rows
  const [skillsTotal, skillsWithEn, coursesTotal, coursesWithEn] = await Promise.all([
    prisma.skill.count(),
    prisma.skill.count({ where: { NOT: { nameEn: null } } }),
    prisma.course.count(),
    prisma.course.count({ where: { NOT: { titleEn: null } } })
  ]);
  console.log(`📊 Skills: ${skillsWithEn}/${skillsTotal} have nameEn`);
  console.log(`📊 Courses: ${coursesWithEn}/${coursesTotal} have titleEn`);

  console.log("🎉 Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
