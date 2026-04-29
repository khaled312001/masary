import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding masary database...");

  // ---------- Skills ----------
  const skillNames = [
    "التواصل الفعّال",
    "العمل ضمن فريق",
    "حل المشكلات",
    "التفكير التحليلي",
    "إدارة الوقت",
    "اللغة الإنجليزية",
    "Microsoft Excel",
    "Microsoft PowerPoint",
    "Microsoft Word",
    "Power BI",
    "Tableau",
    "SQL",
    "Python",
    "Pandas",
    "تحليل البيانات",
    "ذكاء أعمال",
    "إدارة المشاريع",
    "PMP",
    "Agile / Scrum",
    "إدارة المخاطر",
    "التحليل المالي",
    "المحاسبة",
    "إعداد الميزانيات",
    "IFRS",
    "الموارد البشرية",
    "التوظيف والاستقطاب",
    "تطوير أنظمة الأداء",
    "خدمة العملاء",
    "المبيعات",
    "التسويق الرقمي",
    "Google Ads",
    "Meta Ads",
    "تحسين محركات البحث SEO",
    "كتابة المحتوى",
    "تصميم الجرافيك",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Figma",
    "تجربة المستخدم UX",
    "واجهة المستخدم UI",
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "REST APIs",
    "Git & GitHub",
    "Docker",
    "AWS",
    "Azure",
    "Linux",
    "أمن المعلومات",
    "Cybersecurity Fundamentals",
    "تعلّم الآلة",
    "الذكاء الاصطناعي",
    "ChatGPT للأعمال",
    "إعداد التقارير",
    "إدارة الجودة",
    "السلامة المهنية HSE"
  ];

  for (const name of skillNames) {
    await prisma.skill.upsert({
      where: { nameAr: name },
      update: {},
      create: { nameAr: name }
    });
  }
  console.log(`✅ Skills: ${skillNames.length}`);

  const skillIdByName = Object.fromEntries(
    (await prisma.skill.findMany()).map((s) => [s.nameAr, s.id])
  );

  // ---------- Companies ----------
  const companies = [
    { nameAr: "أرامكو السعودية", nameEn: "Saudi Aramco", industry: "طاقة وبترول", website: "https://www.aramco.com" },
    { nameAr: "سابك", nameEn: "SABIC", industry: "بتروكيماويات", website: "https://www.sabic.com" },
    { nameAr: "معادن", nameEn: "Ma'aden", industry: "تعدين", website: "https://www.maaden.com.sa" },
    { nameAr: "الهيئة السعودية للمدن الصناعية ومناطق التقنية (مدن)", nameEn: "MODON", industry: "صناعي", website: "https://www.modon.gov.sa" },
    { nameAr: "مصرف الراجحي", nameEn: "Al Rajhi Bank", industry: "بنوك", website: "https://www.alrajhibank.com.sa" },
    { nameAr: "البنك الأهلي السعودي", nameEn: "SNB", industry: "بنوك", website: "https://www.alahli.com" },
    { nameAr: "stc", nameEn: "stc", industry: "اتصالات", website: "https://www.stc.com.sa" },
    { nameAr: "نيوم", nameEn: "NEOM", industry: "مشاريع كبرى", website: "https://www.neom.com" },
    { nameAr: "البحر الأحمر العالمية", nameEn: "Red Sea Global", industry: "سياحة", website: "https://www.redseaglobal.com" },
    { nameAr: "الخطوط السعودية", nameEn: "Saudia", industry: "طيران", website: "https://www.saudia.com" },
    { nameAr: "صندوق الاستثمارات العامة", nameEn: "PIF", industry: "استثمار", website: "https://www.pif.gov.sa" },
    { nameAr: "روشن", nameEn: "ROSHN", industry: "تطوير عقاري", website: "https://www.roshn.sa" }
  ];
  for (const c of companies) {
    const exists = await prisma.company.findFirst({ where: { nameAr: c.nameAr } });
    if (!exists) await prisma.company.create({ data: c });
  }
  console.log(`✅ Companies: ${companies.length}`);

  // ---------- Platforms ----------
  const platforms = [
    { nameAr: "إدراك", nameEn: "Edraak", website: "https://www.edraak.org" },
    { nameAr: "رواق", nameEn: "Rwaq", website: "https://www.rwaq.org" },
    { nameAr: "كورسيرا", nameEn: "Coursera", website: "https://www.coursera.org" },
    { nameAr: "يوديمي", nameEn: "Udemy", website: "https://www.udemy.com" },
    { nameAr: "إديكس", nameEn: "edX", website: "https://www.edx.org" },
    { nameAr: "لينكدإن ليرننج", nameEn: "LinkedIn Learning", website: "https://www.linkedin.com/learning" },
    { nameAr: "أكاديمية طويق", nameEn: "Tuwaiq Academy", website: "https://tuwaiq.edu.sa" },
    { nameAr: "دروب", nameEn: "Doroob", website: "https://www.doroob.sa" },
    { nameAr: "منصة المهارات الرقمية", nameEn: "Saudi Digital Academy", website: "https://sda.edu.sa" }
  ];
  for (const p of platforms) {
    const exists = await prisma.platform.findFirst({ where: { nameAr: p.nameAr } });
    if (!exists) await prisma.platform.create({ data: p });
  }
  console.log(`✅ Platforms: ${platforms.length}`);

  const platformIdByName = Object.fromEntries(
    (await prisma.platform.findMany()).map((p) => [p.nameAr, p.id])
  );

  // ---------- Courses ----------
  const courses = [
    {
      titleAr: "أساسيات تحليل البيانات",
      platform: "إدراك",
      url: "https://www.edraak.org/courses/",
      durationHrs: 20,
      level: "beginner",
      isFree: true,
      skills: ["تحليل البيانات", "Microsoft Excel", "إعداد التقارير"]
    },
    {
      titleAr: "Google Data Analytics",
      platform: "كورسيرا",
      url: "https://www.coursera.org/professional-certificates/google-data-analytics",
      durationHrs: 180,
      level: "beginner",
      isFree: false,
      skills: ["تحليل البيانات", "SQL", "ذكاء أعمال", "Power BI"]
    },
    {
      titleAr: "Python for Everybody",
      platform: "كورسيرا",
      url: "https://www.coursera.org/specializations/python",
      durationHrs: 80,
      level: "beginner",
      isFree: false,
      skills: ["Python", "تحليل البيانات", "Pandas"]
    },
    {
      titleAr: "أساسيات Power BI",
      platform: "أكاديمية طويق",
      url: "https://tuwaiq.edu.sa",
      durationHrs: 30,
      level: "beginner",
      isFree: true,
      skills: ["Power BI", "ذكاء أعمال", "تحليل البيانات"]
    },
    {
      titleAr: "أساسيات تطوير الويب الحديث",
      platform: "أكاديمية طويق",
      url: "https://tuwaiq.edu.sa",
      durationHrs: 60,
      level: "beginner",
      isFree: true,
      skills: ["HTML", "CSS", "JavaScript", "React"]
    },
    {
      titleAr: "إدارة المشاريع — تأسيس PMP",
      platform: "يوديمي",
      url: "https://www.udemy.com",
      durationHrs: 35,
      level: "intermediate",
      isFree: false,
      skills: ["إدارة المشاريع", "PMP", "إدارة المخاطر"]
    },
    {
      titleAr: "Scrum Master أساسيات",
      platform: "كورسيرا",
      url: "https://www.coursera.org",
      durationHrs: 15,
      level: "beginner",
      isFree: false,
      skills: ["Agile / Scrum", "إدارة المشاريع"]
    },
    {
      titleAr: "Excel للأعمال — متقدم",
      platform: "لينكدإن ليرننج",
      url: "https://www.linkedin.com/learning",
      durationHrs: 12,
      level: "intermediate",
      isFree: false,
      skills: ["Microsoft Excel", "تحليل البيانات", "إعداد التقارير"]
    },
    {
      titleAr: "Digital Marketing — Google",
      platform: "كورسيرا",
      url: "https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce",
      durationHrs: 120,
      level: "beginner",
      isFree: false,
      skills: ["التسويق الرقمي", "Google Ads", "تحسين محركات البحث SEO"]
    },
    {
      titleAr: "أساسيات الموارد البشرية",
      platform: "رواق",
      url: "https://www.rwaq.org",
      durationHrs: 18,
      level: "beginner",
      isFree: true,
      skills: ["الموارد البشرية", "التوظيف والاستقطاب"]
    },
    {
      titleAr: "AWS Cloud Practitioner",
      platform: "كورسيرا",
      url: "https://www.coursera.org/learn/aws-cloud-technical-essentials",
      durationHrs: 25,
      level: "beginner",
      isFree: false,
      skills: ["AWS", "Linux", "Docker"]
    },
    {
      titleAr: "Cybersecurity Fundamentals",
      platform: "إديكس",
      url: "https://www.edx.org",
      durationHrs: 30,
      level: "beginner",
      isFree: false,
      skills: ["أمن المعلومات", "Cybersecurity Fundamentals", "Linux"]
    },
    {
      titleAr: "أساسيات الذكاء الاصطناعي للأعمال",
      platform: "كورسيرا",
      url: "https://www.coursera.org/learn/ai-for-everyone",
      durationHrs: 12,
      level: "beginner",
      isFree: false,
      skills: ["الذكاء الاصطناعي", "تعلّم الآلة", "ChatGPT للأعمال"]
    },
    {
      titleAr: "تصميم تجربة المستخدم UX",
      platform: "كورسيرا",
      url: "https://www.coursera.org/professional-certificates/google-ux-design",
      durationHrs: 100,
      level: "beginner",
      isFree: false,
      skills: ["تجربة المستخدم UX", "واجهة المستخدم UI", "Figma"]
    },
    {
      titleAr: "اللغة الإنجليزية للأعمال",
      platform: "إدراك",
      url: "https://www.edraak.org/courses/",
      durationHrs: 24,
      level: "beginner",
      isFree: true,
      skills: ["اللغة الإنجليزية", "التواصل الفعّال"]
    },
    {
      titleAr: "أساسيات IFRS",
      platform: "يوديمي",
      url: "https://www.udemy.com",
      durationHrs: 15,
      level: "intermediate",
      isFree: false,
      skills: ["IFRS", "المحاسبة", "التحليل المالي"]
    }
  ];

  for (const c of courses) {
    const platformId = platformIdByName[c.platform];
    const exists = await prisma.course.findFirst({ where: { titleAr: c.titleAr } });
    if (exists) continue;
    await prisma.course.create({
      data: {
        titleAr: c.titleAr,
        url: c.url,
        durationHrs: c.durationHrs,
        level: c.level,
        isFree: c.isFree,
        language: "ar",
        platformId,
        skills: {
          create: c.skills
            .map((s) => ({ skillId: skillIdByName[s] }))
            .filter((x) => x.skillId)
        }
      }
    });
  }
  console.log(`✅ Courses: ${courses.length}`);

  // ---------- Jobs ----------
  const jobs = [
    {
      titleAr: "محلل بيانات",
      titleEn: "Data Analyst",
      category: "تقني",
      level: "entry",
      descriptionAr:
        "محلل بيانات مسؤول عن جمع وتحليل البيانات وإعداد التقارير ولوحات المعلومات لدعم اتخاذ القرار.",
      skills: [
        ["تحليل البيانات", 5],
        ["SQL", 5],
        ["Microsoft Excel", 4],
        ["Power BI", 4],
        ["Python", 3],
        ["إعداد التقارير", 4],
        ["اللغة الإنجليزية", 3]
      ]
    },
    {
      titleAr: "مطور ويب",
      titleEn: "Web Developer",
      category: "تقني",
      level: "entry",
      descriptionAr: "تطوير وصيانة واجهات وخلفيات تطبيقات الويب باستخدام أحدث التقنيات.",
      skills: [
        ["HTML", 5],
        ["CSS", 5],
        ["JavaScript", 5],
        ["React", 4],
        ["Node.js", 3],
        ["Git & GitHub", 4],
        ["REST APIs", 3]
      ]
    },
    {
      titleAr: "أخصائي موارد بشرية",
      titleEn: "HR Specialist",
      category: "إداري",
      level: "entry",
      descriptionAr:
        "يدعم عمليات التوظيف والاستقطاب وتطوير أنظمة الأداء وعلاقات الموظفين.",
      skills: [
        ["الموارد البشرية", 5],
        ["التوظيف والاستقطاب", 5],
        ["تطوير أنظمة الأداء", 4],
        ["التواصل الفعّال", 4],
        ["Microsoft Excel", 3],
        ["اللغة الإنجليزية", 3]
      ]
    },
    {
      titleAr: "مدير مشروع",
      titleEn: "Project Manager",
      category: "إداري",
      level: "mid",
      descriptionAr: "قيادة المشاريع من التخطيط إلى التسليم بإدارة الموارد والمخاطر والجدول الزمني.",
      skills: [
        ["إدارة المشاريع", 5],
        ["PMP", 4],
        ["Agile / Scrum", 4],
        ["إدارة المخاطر", 4],
        ["التواصل الفعّال", 5],
        ["اللغة الإنجليزية", 3]
      ]
    },
    {
      titleAr: "محلل مالي",
      titleEn: "Financial Analyst",
      category: "مالي",
      level: "entry",
      descriptionAr: "تحليل البيانات المالية وإعداد التقارير ودعم قرارات الإدارة المالية.",
      skills: [
        ["التحليل المالي", 5],
        ["المحاسبة", 4],
        ["IFRS", 3],
        ["إعداد الميزانيات", 4],
        ["Microsoft Excel", 5],
        ["اللغة الإنجليزية", 3]
      ]
    },
    {
      titleAr: "أخصائي تسويق رقمي",
      titleEn: "Digital Marketing Specialist",
      category: "تسويق",
      level: "entry",
      descriptionAr: "تخطيط وتنفيذ حملات التسويق الرقمي وتحسين محركات البحث وقياس الأداء.",
      skills: [
        ["التسويق الرقمي", 5],
        ["Google Ads", 4],
        ["Meta Ads", 4],
        ["تحسين محركات البحث SEO", 4],
        ["كتابة المحتوى", 3],
        ["تحليل البيانات", 3]
      ]
    },
    {
      titleAr: "مصمم تجربة المستخدم",
      titleEn: "UX Designer",
      category: "تصميم",
      level: "entry",
      descriptionAr: "تصميم تجارب رقمية متمحورة حول المستخدم بإجراء أبحاث وعمل نماذج أولية.",
      skills: [
        ["تجربة المستخدم UX", 5],
        ["واجهة المستخدم UI", 4],
        ["Figma", 5],
        ["التفكير التحليلي", 4],
        ["Adobe Photoshop", 3]
      ]
    },
    {
      titleAr: "أخصائي أمن سيبراني",
      titleEn: "Cybersecurity Analyst",
      category: "تقني",
      level: "mid",
      descriptionAr: "حماية الأنظمة والشبكات والبيانات من التهديدات الإلكترونية ومراقبة الحوادث.",
      skills: [
        ["أمن المعلومات", 5],
        ["Cybersecurity Fundamentals", 5],
        ["Linux", 4],
        ["Python", 3],
        ["اللغة الإنجليزية", 4]
      ]
    },
    {
      titleAr: "مهندس ذكاء اصطناعي",
      titleEn: "AI Engineer",
      category: "تقني",
      level: "mid",
      descriptionAr: "تصميم وتطوير حلول الذكاء الاصطناعي ونماذج تعلّم الآلة وتطبيقاتها.",
      skills: [
        ["الذكاء الاصطناعي", 5],
        ["تعلّم الآلة", 5],
        ["Python", 5],
        ["Pandas", 4],
        ["SQL", 3],
        ["AWS", 3]
      ]
    },
    {
      titleAr: "أخصائي مبيعات",
      titleEn: "Sales Specialist",
      category: "مبيعات",
      level: "entry",
      descriptionAr: "بناء علاقات مع العملاء وتحقيق أهداف المبيعات وتقديم العروض.",
      skills: [
        ["المبيعات", 5],
        ["التواصل الفعّال", 5],
        ["خدمة العملاء", 4],
        ["إدارة الوقت", 3],
        ["Microsoft Excel", 3]
      ]
    }
  ];

  for (const j of jobs) {
    const existing = await prisma.job.findFirst({ where: { titleAr: j.titleAr } });
    if (existing) continue;
    await prisma.job.create({
      data: {
        titleAr: j.titleAr,
        titleEn: j.titleEn,
        category: j.category,
        level: j.level,
        descriptionAr: j.descriptionAr,
        skills: {
          create: j.skills
            .map(([name, importance]) => ({
              skillId: skillIdByName[name as string],
              importance: importance as number
            }))
            .filter((x) => x.skillId)
        }
      }
    });
  }
  console.log(`✅ Jobs: ${jobs.length}`);

  console.log("🎉 Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
