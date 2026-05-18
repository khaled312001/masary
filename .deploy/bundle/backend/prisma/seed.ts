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

  // ---------- Saudi market expansion ----------
  const saudiSkillNames = [
    "حوكمة البيانات",
    "هندسة البيانات",
    "نمذجة البيانات",
    "ETL",
    "Data Warehousing",
    "Apache Spark",
    "BigQuery",
    "Looker Studio",
    "تحليل الأعمال",
    "جمع المتطلبات",
    "كتابة وثائق BRD",
    "كتابة وثائق SRS",
    "تحسين العمليات",
    "إدارة المنتجات",
    "Product Roadmap",
    "تحليل تجربة العميل",
    "إدارة علاقات العملاء CRM",
    "Salesforce",
    "SAP",
    "Oracle ERP",
    "إدارة سلسلة الإمداد",
    "المشتريات",
    "إدارة العقود",
    "إدارة المخزون",
    "الخدمات اللوجستية",
    "التخليص الجمركي",
    "إدارة المستودعات",
    "Lean Six Sigma",
    "إدارة الجودة الشاملة",
    "ISO 9001",
    "ISO 45001",
    "إدارة الامتثال",
    "حوكمة الشركات",
    "إدارة أصحاب المصلحة",
    "إدارة التغيير",
    "إدارة الفعاليات",
    "العلاقات العامة",
    "الاتصال المؤسسي",
    "إدارة المحتوى",
    "التسويق عبر المؤثرين",
    "إدارة الحملات",
    "تحليل أداء الحملات",
    "التجارة الإلكترونية",
    "إدارة المتاجر الإلكترونية",
    "تحسين معدل التحويل CRO",
    "خدمة العملاء عبر القنوات",
    "إدارة تجربة العميل CX",
    "إدارة مراكز الاتصال",
    "التأمين",
    "المطالبات التأمينية",
    "التمويل الإسلامي",
    "التحليل الائتماني",
    "إدارة المحافظ الاستثمارية",
    "تحليل الاستثمار",
    "الزكاة والضريبة",
    "ضريبة القيمة المضافة VAT",
    "المراجعة الداخلية",
    "إدارة الرواتب",
    "نظام مدد",
    "نظام قوى",
    "نظام التأمينات الاجتماعية",
    "قانون العمل السعودي",
    "التدريب والتطوير",
    "إدارة المواهب",
    "التعويضات والمزايا",
    "التخطيط العمراني",
    "إدارة المرافق",
    "إدارة المشاريع العقارية",
    "BIM",
    "AutoCAD",
    "Revit",
    "Primavera P6",
    "حساب الكميات",
    "إدارة الموقع",
    "اختبارات الجودة",
    "السلامة في مواقع العمل",
    "الطاقة المتجددة",
    "إدارة الصيانة",
    "SCADA",
    "PLC",
    "إنترنت الأشياء IoT",
    "إدارة الشبكات",
    "CCNA",
    "Kubernetes",
    "DevOps",
    "CI/CD",
    "اختبار البرمجيات QA",
    "اختبار الاختراق",
    "إدارة الحوادث الأمنية",
    "GRC",
    "NCA ECC",
    "SAMA Cybersecurity Framework",
    "الخصوصية وحماية البيانات",
    "إدارة السجلات الطبية",
    "الترميز الطبي",
    "إدارة المستشفيات",
    "التثقيف الصحي",
    "إدارة الضيافة",
    "إدارة الحجوزات",
    "إدارة المطاعم",
    "سلامة الغذاء",
    "إدارة السياحة",
    "الإرشاد السياحي",
    "إدارة النقل",
    "إدارة الطيران",
    "خدمة المسافرين"
  ];

  for (const name of saudiSkillNames) {
    await prisma.skill.upsert({
      where: { nameAr: name },
      update: {},
      create: { nameAr: name }
    });
  }
  console.log(`✅ Extra skills: ${saudiSkillNames.length}`);

  const allSkillIdByName = Object.fromEntries(
    (await prisma.skill.findMany()).map((s) => [s.nameAr, s.id])
  );

  const saudiCompanies = [
    { nameAr: "شركة علم", nameEn: "Elm", industry: "تقنية", website: "https://www.elm.sa" },
    { nameAr: "سدايا", nameEn: "SDAIA", industry: "ذكاء اصطناعي وبيانات", website: "https://sdaia.gov.sa" },
    { nameAr: "الهيئة السعودية للبيانات والذكاء الاصطناعي", nameEn: "SDAIA", industry: "حكومي وتقني", website: "https://sdaia.gov.sa" },
    { nameAr: "وزارة الاتصالات وتقنية المعلومات", nameEn: "MCIT", industry: "حكومي", website: "https://www.mcit.gov.sa" },
    { nameAr: "هيئة الحكومة الرقمية", nameEn: "Digital Government Authority", industry: "حكومي وتقني", website: "https://dga.gov.sa" },
    { nameAr: "الهيئة الوطنية للأمن السيبراني", nameEn: "NCA", industry: "أمن سيبراني", website: "https://nca.gov.sa" },
    { nameAr: "البنك المركزي السعودي", nameEn: "SAMA", industry: "مالي", website: "https://www.sama.gov.sa" },
    { nameAr: "هيئة السوق المالية", nameEn: "CMA", industry: "مالي وتنظيمي", website: "https://cma.org.sa" },
    { nameAr: "تداول السعودية", nameEn: "Saudi Exchange", industry: "أسواق مالية", website: "https://www.saudiexchange.sa" },
    { nameAr: "شركة الاتصالات السعودية stc", nameEn: "stc", industry: "اتصالات وتقنية", website: "https://www.stc.com.sa" },
    { nameAr: "موبايلي", nameEn: "Mobily", industry: "اتصالات", website: "https://www.mobily.com.sa" },
    { nameAr: "زين السعودية", nameEn: "Zain KSA", industry: "اتصالات", website: "https://sa.zain.com" },
    { nameAr: "تويتر السعودية", nameEn: "X Saudi Arabia", industry: "تقنية وإعلام", website: "https://x.com" },
    { nameAr: "جاهز", nameEn: "Jahez", industry: "تقنية غذائية", website: "https://jahez.net" },
    { nameAr: "هنقرستيشن", nameEn: "HungerStation", industry: "تقنية غذائية", website: "https://hungerstation.com" },
    { nameAr: "نون السعودية", nameEn: "Noon", industry: "تجارة إلكترونية", website: "https://www.noon.com" },
    { nameAr: "أمازون السعودية", nameEn: "Amazon Saudi Arabia", industry: "تجارة إلكترونية", website: "https://www.amazon.sa" },
    { nameAr: "جرير", nameEn: "Jarir", industry: "تجزئة", website: "https://www.jarir.com" },
    { nameAr: "إكسترا", nameEn: "eXtra", industry: "تجزئة", website: "https://www.extra.com" },
    { nameAr: "مجموعة صافولا", nameEn: "Savola Group", industry: "أغذية وتجزئة", website: "https://www.savola.com" },
    { nameAr: "المراعي", nameEn: "Almarai", industry: "أغذية", website: "https://www.almarai.com" },
    { nameAr: "نادك", nameEn: "NADEC", industry: "أغذية وزراعة", website: "https://www.nadec.com.sa" },
    { nameAr: "النهدي الطبية", nameEn: "Nahdi Medical", industry: "رعاية صحية وتجزئة", website: "https://www.nahdi.sa" },
    { nameAr: "مجموعة الدكتور سليمان الحبيب", nameEn: "Dr. Sulaiman Al Habib Medical Group", industry: "رعاية صحية", website: "https://hmg.com" },
    { nameAr: "مستشفى الملك فيصل التخصصي", nameEn: "KFSHRC", industry: "رعاية صحية", website: "https://www.kfshrc.edu.sa" },
    { nameAr: "وزارة الصحة", nameEn: "Ministry of Health", industry: "حكومي وصحي", website: "https://www.moh.gov.sa" },
    { nameAr: "وزارة الموارد البشرية والتنمية الاجتماعية", nameEn: "MHRSD", industry: "حكومي", website: "https://www.hrsd.gov.sa" },
    { nameAr: "هيئة الزكاة والضريبة والجمارك", nameEn: "ZATCA", industry: "حكومي ومالي", website: "https://zatca.gov.sa" },
    { nameAr: "شركة المياه الوطنية", nameEn: "NWC", industry: "خدمات ومرافق", website: "https://www.nwc.com.sa" },
    { nameAr: "الشركة السعودية للكهرباء", nameEn: "Saudi Electricity Company", industry: "طاقة ومرافق", website: "https://www.se.com.sa" },
    { nameAr: "أكوا باور", nameEn: "ACWA Power", industry: "طاقة ومياه", website: "https://www.acwapower.com" },
    { nameAr: "شركة البحر الأحمر الدولية", nameEn: "Red Sea Global", industry: "سياحة ومشاريع كبرى", website: "https://www.redseaglobal.com" },
    { nameAr: "القدية", nameEn: "Qiddiya", industry: "ترفيه ومشاريع كبرى", website: "https://qiddiya.com" },
    { nameAr: "الدرعية", nameEn: "Diriyah Company", industry: "سياحة وتطوير", website: "https://www.diriyahcompany.sa" },
    { nameAr: "بوابة الدرعية", nameEn: "Diriyah Gate", industry: "مشاريع كبرى", website: "https://www.diriyah.sa" },
    { nameAr: "المربع الجديد", nameEn: "New Murabba", industry: "تطوير عقاري", website: "https://newmurabba.com" },
    { nameAr: "شركة وسط جدة للتطوير", nameEn: "Jeddah Central", industry: "تطوير عقاري", website: "https://jeddahcentral.com" },
    { nameAr: "السودة للتطوير", nameEn: "Soudah Development", industry: "سياحة", website: "https://soudah.sa" },
    { nameAr: "طيران الرياض", nameEn: "Riyadh Air", industry: "طيران", website: "https://www.riyadhair.com" },
    { nameAr: "مطارات الرياض", nameEn: "Riyadh Airports", industry: "طيران وخدمات", website: "https://www.riyadhairports.com" },
    { nameAr: "الشركة السعودية للخدمات الأرضية", nameEn: "Saudi Ground Services", industry: "طيران", website: "https://www.sgs.sa" },
    { nameAr: "سار", nameEn: "Saudi Railway Company", industry: "نقل", website: "https://www.sar.com.sa" },
    { nameAr: "البحري", nameEn: "Bahri", industry: "نقل ولوجستيات", website: "https://www.bahri.sa" },
    { nameAr: "سالك", nameEn: "SALIC", industry: "استثمار غذائي", website: "https://www.salic.com" },
    { nameAr: "سرك", nameEn: "SIRC", industry: "بيئة وإعادة تدوير", website: "https://sirc.sa" },
    { nameAr: "شركة تطوير للمباني", nameEn: "TBC", industry: "تشييد وتعليم", website: "https://www.tbc.sa" },
    { nameAr: "بوبا العربية", nameEn: "Bupa Arabia", industry: "تأمين", website: "https://www.bupa.com.sa" },
    { nameAr: "التعاونية للتأمين", nameEn: "Tawuniya", industry: "تأمين", website: "https://www.tawuniya.com.sa" },
    { nameAr: "مصرف الإنماء", nameEn: "Alinma Bank", industry: "بنوك", website: "https://www.alinma.com" },
    { nameAr: "بنك الرياض", nameEn: "Riyad Bank", industry: "بنوك", website: "https://www.riyadbank.com" },
    { nameAr: "البنك السعودي الفرنسي", nameEn: "BSF", industry: "بنوك", website: "https://www.alfransi.com.sa" },
    { nameAr: "بنك الجزيرة", nameEn: "Bank AlJazira", industry: "بنوك", website: "https://www.bankaljazira.com" }
  ];

  for (const c of saudiCompanies) {
    const exists = await prisma.company.findFirst({ where: { nameAr: c.nameAr } });
    if (!exists) await prisma.company.create({ data: c });
  }
  console.log(`✅ Extra companies: ${saudiCompanies.length}`);

  const saudiPlatforms = [
    { nameAr: "أكاديمية سدايا", nameEn: "SDAIA Academy", website: "https://academy.sdaia.gov.sa" },
    { nameAr: "مسك المهارات", nameEn: "Misk Skills", website: "https://hub.misk.org.sa" },
    { nameAr: "هدف دروب", nameEn: "Doroob", website: "https://www.doroob.sa" },
    { nameAr: "منشآت", nameEn: "Monsha'at Academy", website: "https://academy.monshaat.gov.sa" },
    { nameAr: "هيئة المهندسين", nameEn: "Saudi Council of Engineers", website: "https://www.saudieng.sa" },
    { nameAr: "CME", nameEn: "CME", website: "https://cme.cma.org.sa" }
  ];

  for (const p of saudiPlatforms) {
    const exists = await prisma.platform.findFirst({ where: { nameAr: p.nameAr } });
    if (!exists) await prisma.platform.create({ data: p });
  }

  const allPlatformIdByName = Object.fromEntries(
    (await prisma.platform.findMany()).map((p) => [p.nameAr, p.id])
  );

  const saudiCourses = [
    { titleAr: "تحليل الأعمال وجمع المتطلبات", platform: "دروب", url: "https://www.doroob.sa", durationHrs: 12, level: "beginner", isFree: true, skills: ["تحليل الأعمال", "جمع المتطلبات", "كتابة وثائق BRD"] },
    { titleAr: "حوكمة البيانات وإدارتها", platform: "أكاديمية سدايا", url: "https://academy.sdaia.gov.sa", durationHrs: 20, level: "intermediate", isFree: true, skills: ["حوكمة البيانات", "نمذجة البيانات", "إدارة الامتثال"] },
    { titleAr: "أساسيات هندسة البيانات", platform: "كورسيرا", url: "https://www.coursera.org", durationHrs: 45, level: "intermediate", isFree: false, skills: ["هندسة البيانات", "ETL", "Data Warehousing", "SQL"] },
    { titleAr: "Looker Studio للأعمال", platform: "يوديمي", url: "https://www.udemy.com", durationHrs: 8, level: "beginner", isFree: false, skills: ["Looker Studio", "إعداد التقارير", "تحليل البيانات"] },
    { titleAr: "إدارة المنتجات الرقمية", platform: "مسك المهارات", url: "https://hub.misk.org.sa", durationHrs: 18, level: "intermediate", isFree: true, skills: ["إدارة المنتجات", "Product Roadmap", "تحليل تجربة العميل"] },
    { titleAr: "أساسيات تجربة العميل CX", platform: "دروب", url: "https://www.doroob.sa", durationHrs: 10, level: "beginner", isFree: true, skills: ["إدارة تجربة العميل CX", "خدمة العملاء عبر القنوات", "تحليل تجربة العميل"] },
    { titleAr: "إدارة سلسلة الإمداد", platform: "كورسيرا", url: "https://www.coursera.org", durationHrs: 30, level: "beginner", isFree: false, skills: ["إدارة سلسلة الإمداد", "المشتريات", "إدارة المخزون"] },
    { titleAr: "أساسيات المشتريات وإدارة العقود", platform: "منشآت", url: "https://academy.monshaat.gov.sa", durationHrs: 12, level: "beginner", isFree: true, skills: ["المشتريات", "إدارة العقود", "إدارة أصحاب المصلحة"] },
    { titleAr: "Lean Six Sigma Yellow Belt", platform: "يوديمي", url: "https://www.udemy.com", durationHrs: 10, level: "beginner", isFree: false, skills: ["Lean Six Sigma", "تحسين العمليات", "إدارة الجودة الشاملة"] },
    { titleAr: "إدارة الجودة ISO 9001", platform: "إديكس", url: "https://www.edx.org", durationHrs: 16, level: "intermediate", isFree: false, skills: ["ISO 9001", "إدارة الجودة الشاملة", "اختبارات الجودة"] },
    { titleAr: "السلامة والصحة المهنية ISO 45001", platform: "يوديمي", url: "https://www.udemy.com", durationHrs: 14, level: "intermediate", isFree: false, skills: ["ISO 45001", "السلامة المهنية HSE", "السلامة في مواقع العمل"] },
    { titleAr: "الامتثال والحوكمة للشركات", platform: "دروب", url: "https://www.doroob.sa", durationHrs: 10, level: "intermediate", isFree: true, skills: ["إدارة الامتثال", "حوكمة الشركات", "إدارة المخاطر"] },
    { titleAr: "ضريبة القيمة المضافة في السعودية", platform: "دروب", url: "https://www.doroob.sa", durationHrs: 8, level: "beginner", isFree: true, skills: ["ضريبة القيمة المضافة VAT", "الزكاة والضريبة", "المحاسبة"] },
    { titleAr: "المراجعة الداخلية وإدارة المخاطر", platform: "كورسيرا", url: "https://www.coursera.org", durationHrs: 25, level: "intermediate", isFree: false, skills: ["المراجعة الداخلية", "إدارة المخاطر", "إدارة الامتثال"] },
    { titleAr: "التمويل الإسلامي", platform: "إدراك", url: "https://www.edraak.org", durationHrs: 16, level: "beginner", isFree: true, skills: ["التمويل الإسلامي", "التحليل المالي", "المحاسبة"] },
    { titleAr: "التحليل الائتماني", platform: "يوديمي", url: "https://www.udemy.com", durationHrs: 12, level: "intermediate", isFree: false, skills: ["التحليل الائتماني", "التحليل المالي", "Microsoft Excel"] },
    { titleAr: "قانون العمل السعودي للموارد البشرية", platform: "دروب", url: "https://www.doroob.sa", durationHrs: 8, level: "beginner", isFree: true, skills: ["قانون العمل السعودي", "نظام قوى", "نظام التأمينات الاجتماعية"] },
    { titleAr: "إدارة الرواتب والتأمينات", platform: "دروب", url: "https://www.doroob.sa", durationHrs: 10, level: "beginner", isFree: true, skills: ["إدارة الرواتب", "نظام مدد", "نظام التأمينات الاجتماعية"] },
    { titleAr: "إدارة المواهب والتعاقب الوظيفي", platform: "لينكدإن ليرننج", url: "https://www.linkedin.com/learning", durationHrs: 8, level: "intermediate", isFree: false, skills: ["إدارة المواهب", "التدريب والتطوير", "التعويضات والمزايا"] },
    { titleAr: "أساسيات AutoCAD", platform: "هيئة المهندسين", url: "https://www.saudieng.sa", durationHrs: 24, level: "beginner", isFree: false, skills: ["AutoCAD", "حساب الكميات", "إدارة الموقع"] },
    { titleAr: "BIM وRevit للمشاريع", platform: "يوديمي", url: "https://www.udemy.com", durationHrs: 30, level: "intermediate", isFree: false, skills: ["BIM", "Revit", "إدارة المشاريع العقارية"] },
    { titleAr: "Primavera P6 لإدارة المشاريع", platform: "يوديمي", url: "https://www.udemy.com", durationHrs: 18, level: "intermediate", isFree: false, skills: ["Primavera P6", "إدارة المشاريع", "إدارة الموقع"] },
    { titleAr: "إدارة المرافق", platform: "دروب", url: "https://www.doroob.sa", durationHrs: 12, level: "beginner", isFree: true, skills: ["إدارة المرافق", "إدارة الصيانة", "إدارة الجودة الشاملة"] },
    { titleAr: "أساسيات الطاقة المتجددة", platform: "إديكس", url: "https://www.edx.org", durationHrs: 20, level: "beginner", isFree: false, skills: ["الطاقة المتجددة", "إدارة الصيانة", "SCADA"] },
    { titleAr: "CCNA أساسيات الشبكات", platform: "كورسيرا", url: "https://www.coursera.org", durationHrs: 45, level: "beginner", isFree: false, skills: ["إدارة الشبكات", "CCNA", "أمن المعلومات"] },
    { titleAr: "DevOps وCI/CD", platform: "أكاديمية طويق", url: "https://tuwaiq.edu.sa", durationHrs: 40, level: "intermediate", isFree: true, skills: ["DevOps", "CI/CD", "Docker", "Kubernetes"] },
    { titleAr: "اختبار البرمجيات QA", platform: "أكاديمية طويق", url: "https://tuwaiq.edu.sa", durationHrs: 32, level: "beginner", isFree: true, skills: ["اختبار البرمجيات QA", "Git & GitHub", "REST APIs"] },
    { titleAr: "GRC والأطر السعودية للأمن السيبراني", platform: "أكاديمية طويق", url: "https://tuwaiq.edu.sa", durationHrs: 24, level: "intermediate", isFree: true, skills: ["GRC", "NCA ECC", "SAMA Cybersecurity Framework"] },
    { titleAr: "اختبار الاختراق للمبتدئين", platform: "إديكس", url: "https://www.edx.org", durationHrs: 35, level: "intermediate", isFree: false, skills: ["اختبار الاختراق", "Linux", "إدارة الحوادث الأمنية"] },
    { titleAr: "إدارة المستشفيات", platform: "دروب", url: "https://www.doroob.sa", durationHrs: 15, level: "beginner", isFree: true, skills: ["إدارة المستشفيات", "إدارة السجلات الطبية", "خدمة العملاء"] },
    { titleAr: "الترميز الطبي", platform: "دروب", url: "https://www.doroob.sa", durationHrs: 20, level: "beginner", isFree: true, skills: ["الترميز الطبي", "إدارة السجلات الطبية", "اللغة الإنجليزية"] },
    { titleAr: "إدارة الضيافة والسياحة", platform: "دروب", url: "https://www.doroob.sa", durationHrs: 15, level: "beginner", isFree: true, skills: ["إدارة الضيافة", "إدارة السياحة", "خدمة العملاء"] },
    { titleAr: "سلامة الغذاء للمطاعم", platform: "منشآت", url: "https://academy.monshaat.gov.sa", durationHrs: 8, level: "beginner", isFree: true, skills: ["سلامة الغذاء", "إدارة المطاعم", "إدارة الجودة الشاملة"] },
    { titleAr: "إدارة التجارة الإلكترونية", platform: "منشآت", url: "https://academy.monshaat.gov.sa", durationHrs: 18, level: "beginner", isFree: true, skills: ["التجارة الإلكترونية", "إدارة المتاجر الإلكترونية", "تحسين معدل التحويل CRO"] },
    { titleAr: "Salesforce CRM Basics", platform: "كورسيرا", url: "https://www.coursera.org", durationHrs: 20, level: "beginner", isFree: false, skills: ["Salesforce", "إدارة علاقات العملاء CRM", "المبيعات"] },
    { titleAr: "SAP أساسيات للمستخدمين", platform: "يوديمي", url: "https://www.udemy.com", durationHrs: 18, level: "beginner", isFree: false, skills: ["SAP", "Oracle ERP", "إدارة سلسلة الإمداد"] },
    { titleAr: "الاتصال المؤسسي والعلاقات العامة", platform: "مسك المهارات", url: "https://hub.misk.org.sa", durationHrs: 10, level: "beginner", isFree: true, skills: ["الاتصال المؤسسي", "العلاقات العامة", "إدارة المحتوى"] },
    { titleAr: "إدارة الفعاليات", platform: "دروب", url: "https://www.doroob.sa", durationHrs: 12, level: "beginner", isFree: true, skills: ["إدارة الفعاليات", "إدارة أصحاب المصلحة", "التواصل الفعّال"] },
    { titleAr: "إدارة النقل والخدمات اللوجستية", platform: "دروب", url: "https://www.doroob.sa", durationHrs: 16, level: "beginner", isFree: true, skills: ["إدارة النقل", "الخدمات اللوجستية", "إدارة المستودعات"] },
    { titleAr: "خدمة المسافرين في قطاع الطيران", platform: "دروب", url: "https://www.doroob.sa", durationHrs: 8, level: "beginner", isFree: true, skills: ["خدمة المسافرين", "إدارة الطيران", "خدمة العملاء"] }
  ];

  for (const c of saudiCourses) {
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
        platformId: allPlatformIdByName[c.platform],
        skills: {
          create: c.skills
            .map((s) => ({ skillId: allSkillIdByName[s] }))
            .filter((x) => x.skillId)
        }
      }
    });
  }
  console.log(`✅ Extra courses: ${saudiCourses.length}`);

  const saudiJobs = [
    { titleAr: "مهندس بيانات", titleEn: "Data Engineer", category: "تقني", level: "mid", descriptionAr: "تصميم وبناء خطوط البيانات ومستودعات البيانات لدعم التحليلات وذكاء الأعمال.", skills: [["هندسة البيانات", 5], ["ETL", 5], ["SQL", 5], ["Python", 4], ["Data Warehousing", 4], ["Apache Spark", 3]] },
    { titleAr: "محلل أعمال", titleEn: "Business Analyst", category: "إداري وتقني", level: "mid", descriptionAr: "تحليل احتياجات الأعمال وتوثيق المتطلبات وربط الفرق التقنية بالإدارات التشغيلية.", skills: [["تحليل الأعمال", 5], ["جمع المتطلبات", 5], ["كتابة وثائق BRD", 4], ["تحسين العمليات", 4], ["التواصل الفعّال", 5]] },
    { titleAr: "مدير منتج", titleEn: "Product Manager", category: "تقني وإداري", level: "mid", descriptionAr: "قيادة دورة حياة المنتج الرقمي من الرؤية إلى الإطلاق والتحسين المستمر.", skills: [["إدارة المنتجات", 5], ["Product Roadmap", 5], ["تحليل تجربة العميل", 4], ["Agile / Scrum", 4], ["إدارة أصحاب المصلحة", 5]] },
    { titleAr: "أخصائي تجربة عميل", titleEn: "Customer Experience Specialist", category: "خدمة العملاء", level: "entry", descriptionAr: "تحسين رحلة العميل وقياس الرضا ومعالجة نقاط الألم في القنوات المختلفة.", skills: [["إدارة تجربة العميل CX", 5], ["خدمة العملاء عبر القنوات", 5], ["تحليل تجربة العميل", 4], ["إعداد التقارير", 3]] },
    { titleAr: "مدير مركز اتصال", titleEn: "Call Center Manager", category: "خدمة العملاء", level: "mid", descriptionAr: "إدارة عمليات مركز الاتصال ورفع جودة الخدمة ومؤشرات الأداء.", skills: [["إدارة مراكز الاتصال", 5], ["خدمة العملاء", 5], ["إعداد التقارير", 4], ["إدارة الوقت", 4]] },
    { titleAr: "أخصائي مشتريات", titleEn: "Procurement Specialist", category: "سلاسل الإمداد", level: "entry", descriptionAr: "تنفيذ عمليات الشراء والتفاوض مع الموردين وإدارة طلبات الشراء.", skills: [["المشتريات", 5], ["إدارة العقود", 4], ["Microsoft Excel", 4], ["إدارة أصحاب المصلحة", 3]] },
    { titleAr: "أخصائي عقود", titleEn: "Contracts Specialist", category: "سلاسل الإمداد", level: "mid", descriptionAr: "إعداد ومراجعة العقود ومتابعة الالتزامات والمخاطر التعاقدية.", skills: [["إدارة العقود", 5], ["إدارة المخاطر", 4], ["إدارة الامتثال", 4], ["اللغة الإنجليزية", 4]] },
    { titleAr: "محلل سلاسل إمداد", titleEn: "Supply Chain Analyst", category: "سلاسل الإمداد", level: "entry", descriptionAr: "تحليل الطلب والمخزون والتوريد لتحسين الكفاءة وخفض التكلفة.", skills: [["إدارة سلسلة الإمداد", 5], ["إدارة المخزون", 4], ["Microsoft Excel", 5], ["تحليل البيانات", 4]] },
    { titleAr: "منسق لوجستيات", titleEn: "Logistics Coordinator", category: "لوجستيات", level: "entry", descriptionAr: "تنسيق الشحنات والمستودعات والتسليم ومتابعة مزودي الخدمات اللوجستية.", skills: [["الخدمات اللوجستية", 5], ["إدارة المستودعات", 4], ["التخليص الجمركي", 3], ["إدارة الوقت", 4]] },
    { titleAr: "أخصائي جودة", titleEn: "Quality Specialist", category: "جودة", level: "entry", descriptionAr: "متابعة معايير الجودة وتحسين العمليات وتوثيق الإجراءات.", skills: [["إدارة الجودة الشاملة", 5], ["ISO 9001", 4], ["تحسين العمليات", 4], ["إعداد التقارير", 4]] },
    { titleAr: "أخصائي سلامة وصحة مهنية", titleEn: "HSE Specialist", category: "سلامة", level: "entry", descriptionAr: "تطبيق اشتراطات السلامة والصحة المهنية في مواقع العمل والمنشآت.", skills: [["السلامة المهنية HSE", 5], ["ISO 45001", 4], ["السلامة في مواقع العمل", 5], ["إعداد التقارير", 3]] },
    { titleAr: "أخصائي امتثال", titleEn: "Compliance Specialist", category: "حوكمة", level: "mid", descriptionAr: "متابعة الالتزام بالسياسات واللوائح وإعداد تقارير الامتثال.", skills: [["إدارة الامتثال", 5], ["حوكمة الشركات", 4], ["إدارة المخاطر", 4], ["المراجعة الداخلية", 3]] },
    { titleAr: "مراجع داخلي", titleEn: "Internal Auditor", category: "مالي وحوكمة", level: "mid", descriptionAr: "تنفيذ مهام المراجعة الداخلية وتقييم الضوابط والمخاطر.", skills: [["المراجعة الداخلية", 5], ["إدارة المخاطر", 4], ["المحاسبة", 4], ["IFRS", 3]] },
    { titleAr: "محاسب ضرائب وزكاة", titleEn: "Tax Accountant", category: "مالي", level: "mid", descriptionAr: "إعداد إقرارات الزكاة والضريبة ومتابعة الامتثال الضريبي.", skills: [["الزكاة والضريبة", 5], ["ضريبة القيمة المضافة VAT", 5], ["المحاسبة", 5], ["Microsoft Excel", 4]] },
    { titleAr: "محلل ائتماني", titleEn: "Credit Analyst", category: "بنوك", level: "entry", descriptionAr: "تحليل الجدارة الائتمانية ودراسة القوائم المالية ومخاطر العملاء.", skills: [["التحليل الائتماني", 5], ["التحليل المالي", 5], ["Microsoft Excel", 4], ["اللغة الإنجليزية", 3]] },
    { titleAr: "أخصائي مطالبات تأمين", titleEn: "Insurance Claims Specialist", category: "تأمين", level: "entry", descriptionAr: "معالجة مطالبات التأمين ومراجعة المستندات والتواصل مع العملاء.", skills: [["المطالبات التأمينية", 5], ["التأمين", 5], ["خدمة العملاء", 4], ["إدارة الامتثال", 3]] },
    { titleAr: "أخصائي رواتب", titleEn: "Payroll Specialist", category: "موارد بشرية", level: "entry", descriptionAr: "إدارة الرواتب والاستقطاعات والتأمينات والامتثال لأنظمة العمل.", skills: [["إدارة الرواتب", 5], ["نظام مدد", 4], ["نظام التأمينات الاجتماعية", 4], ["Microsoft Excel", 5]] },
    { titleAr: "أخصائي علاقات موظفين", titleEn: "Employee Relations Specialist", category: "موارد بشرية", level: "entry", descriptionAr: "متابعة شؤون الموظفين والعقود والسياسات وأنظمة العمل.", skills: [["قانون العمل السعودي", 5], ["نظام قوى", 4], ["الموارد البشرية", 5], ["التواصل الفعّال", 4]] },
    { titleAr: "أخصائي تدريب وتطوير", titleEn: "Learning and Development Specialist", category: "موارد بشرية", level: "mid", descriptionAr: "تصميم وتنفيذ خطط التدريب وقياس أثر التعلم.", skills: [["التدريب والتطوير", 5], ["إدارة المواهب", 4], ["إعداد التقارير", 3], ["التواصل الفعّال", 4]] },
    { titleAr: "مهندس مدني", titleEn: "Civil Engineer", category: "هندسي", level: "entry", descriptionAr: "الإشراف على الأعمال المدنية ومتابعة الجودة والجداول في المشاريع.", skills: [["AutoCAD", 4], ["إدارة الموقع", 5], ["حساب الكميات", 4], ["السلامة في مواقع العمل", 4]] },
    { titleAr: "مهندس تخطيط مشاريع", titleEn: "Planning Engineer", category: "هندسي", level: "mid", descriptionAr: "إعداد ومتابعة الجداول الزمنية وتحليل الانحرافات في المشاريع.", skills: [["Primavera P6", 5], ["إدارة المشاريع", 4], ["إعداد التقارير", 4], ["Microsoft Excel", 4]] },
    { titleAr: "حاسب كميات", titleEn: "Quantity Surveyor", category: "هندسي", level: "entry", descriptionAr: "حصر الكميات ومراجعة المستخلصات والتكاليف في المشاريع.", skills: [["حساب الكميات", 5], ["AutoCAD", 4], ["Microsoft Excel", 5], ["إدارة العقود", 3]] },
    { titleAr: "أخصائي BIM", titleEn: "BIM Specialist", category: "هندسي", level: "mid", descriptionAr: "إدارة نماذج معلومات البناء والتنسيق بين التخصصات.", skills: [["BIM", 5], ["Revit", 5], ["إدارة المشاريع العقارية", 3], ["التواصل الفعّال", 3]] },
    { titleAr: "مدير مرافق", titleEn: "Facilities Manager", category: "تشغيل", level: "mid", descriptionAr: "إدارة المرافق والصيانة والخدمات التشغيلية للمنشآت.", skills: [["إدارة المرافق", 5], ["إدارة الصيانة", 5], ["إدارة العقود", 4], ["إدارة الجودة الشاملة", 3]] },
    { titleAr: "مهندس صيانة", titleEn: "Maintenance Engineer", category: "تشغيل", level: "entry", descriptionAr: "تخطيط وتنفيذ أعمال الصيانة الوقائية والتصحيحية للمعدات.", skills: [["إدارة الصيانة", 5], ["SCADA", 3], ["PLC", 3], ["إعداد التقارير", 3]] },
    { titleAr: "مهندس شبكات", titleEn: "Network Engineer", category: "تقني", level: "entry", descriptionAr: "تصميم وتشغيل الشبكات ومراقبة الأداء ومعالجة الأعطال.", skills: [["إدارة الشبكات", 5], ["CCNA", 5], ["Linux", 3], ["أمن المعلومات", 3]] },
    { titleAr: "مهندس DevOps", titleEn: "DevOps Engineer", category: "تقني", level: "mid", descriptionAr: "أتمتة النشر والبنية التحتية وإدارة الحاويات وخطوط CI/CD.", skills: [["DevOps", 5], ["CI/CD", 5], ["Docker", 5], ["Kubernetes", 4], ["Linux", 4]] },
    { titleAr: "مختبر برمجيات", titleEn: "QA Tester", category: "تقني", level: "entry", descriptionAr: "اختبار التطبيقات وكتابة سيناريوهات الاختبار وتوثيق العيوب.", skills: [["اختبار البرمجيات QA", 5], ["REST APIs", 3], ["Git & GitHub", 3], ["إعداد التقارير", 4]] },
    { titleAr: "أخصائي GRC", titleEn: "GRC Specialist", category: "أمن سيبراني", level: "mid", descriptionAr: "إدارة الحوكمة والمخاطر والامتثال لأطر الأمن السيبراني.", skills: [["GRC", 5], ["NCA ECC", 5], ["SAMA Cybersecurity Framework", 4], ["إدارة المخاطر", 4]] },
    { titleAr: "محلل مركز عمليات أمنية", titleEn: "SOC Analyst", category: "أمن سيبراني", level: "entry", descriptionAr: "مراقبة التنبيهات الأمنية وتحليل الحوادث والاستجابة الأولية.", skills: [["إدارة الحوادث الأمنية", 5], ["أمن المعلومات", 5], ["Linux", 3], ["تحليل البيانات", 3]] },
    { titleAr: "أخصائي خصوصية بيانات", titleEn: "Data Privacy Specialist", category: "حوكمة وتقنية", level: "mid", descriptionAr: "متابعة الالتزام بسياسات الخصوصية وحماية البيانات.", skills: [["الخصوصية وحماية البيانات", 5], ["إدارة الامتثال", 4], ["حوكمة البيانات", 4], ["إدارة المخاطر", 3]] },
    { titleAr: "أخصائي سجلات طبية", titleEn: "Medical Records Specialist", category: "صحي", level: "entry", descriptionAr: "إدارة السجلات الطبية وجودة البيانات الصحية وسريتها.", skills: [["إدارة السجلات الطبية", 5], ["الترميز الطبي", 4], ["الخصوصية وحماية البيانات", 4]] },
    { titleAr: "منسق خدمات مرضى", titleEn: "Patient Services Coordinator", category: "صحي", level: "entry", descriptionAr: "تنسيق مواعيد وخدمات المرضى وتحسين تجربتهم داخل المنشأة الصحية.", skills: [["خدمة العملاء", 5], ["إدارة المستشفيات", 3], ["التواصل الفعّال", 5], ["إدارة الوقت", 4]] },
    { titleAr: "أخصائي ضيافة", titleEn: "Hospitality Specialist", category: "سياحة وضيافة", level: "entry", descriptionAr: "تقديم خدمات الضيافة وتجربة النزلاء وفق معايير جودة عالية.", skills: [["إدارة الضيافة", 5], ["خدمة العملاء", 5], ["اللغة الإنجليزية", 4], ["إدارة الحجوزات", 3]] },
    { titleAr: "أخصائي سياحة", titleEn: "Tourism Specialist", category: "سياحة وضيافة", level: "entry", descriptionAr: "تطوير التجارب السياحية والتواصل مع الزوار والشركاء.", skills: [["إدارة السياحة", 5], ["الإرشاد السياحي", 4], ["العلاقات العامة", 3], ["اللغة الإنجليزية", 4]] },
    { titleAr: "مدير مطعم", titleEn: "Restaurant Manager", category: "ضيافة", level: "mid", descriptionAr: "إدارة تشغيل المطعم والفريق والمخزون والجودة.", skills: [["إدارة المطاعم", 5], ["سلامة الغذاء", 5], ["خدمة العملاء", 4], ["إدارة المخزون", 4]] },
    { titleAr: "أخصائي تجارة إلكترونية", titleEn: "E-commerce Specialist", category: "تسويق وتجارة", level: "entry", descriptionAr: "إدارة المتجر الإلكتروني والمنتجات والطلبات وتحسين المبيعات.", skills: [["التجارة الإلكترونية", 5], ["إدارة المتاجر الإلكترونية", 5], ["تحسين معدل التحويل CRO", 4], ["التسويق الرقمي", 4]] },
    { titleAr: "أخصائي CRM", titleEn: "CRM Specialist", category: "مبيعات وتسويق", level: "entry", descriptionAr: "إدارة بيانات العملاء والحملات وقنوات التواصل عبر أنظمة CRM.", skills: [["إدارة علاقات العملاء CRM", 5], ["Salesforce", 4], ["تحليل تجربة العميل", 4], ["إعداد التقارير", 3]] },
    { titleAr: "أخصائي اتصال مؤسسي", titleEn: "Corporate Communication Specialist", category: "إعلام واتصال", level: "entry", descriptionAr: "إدارة رسائل المؤسسة ومحتواها وعلاقاتها الإعلامية.", skills: [["الاتصال المؤسسي", 5], ["العلاقات العامة", 5], ["إدارة المحتوى", 4], ["كتابة المحتوى", 4]] },
    { titleAr: "منسق فعاليات", titleEn: "Events Coordinator", category: "فعاليات", level: "entry", descriptionAr: "تنسيق الفعاليات والميزانيات والموردين وتجربة الحضور.", skills: [["إدارة الفعاليات", 5], ["إدارة أصحاب المصلحة", 4], ["إدارة الوقت", 4], ["التواصل الفعّال", 5]] },
    { titleAr: "أخصائي خدمات مسافرين", titleEn: "Passenger Services Agent", category: "طيران", level: "entry", descriptionAr: "خدمة المسافرين في المطارات ومتابعة إجراءات السفر وحل المشكلات.", skills: [["خدمة المسافرين", 5], ["إدارة الطيران", 3], ["خدمة العملاء", 5], ["اللغة الإنجليزية", 4]] },
    { titleAr: "منسق نقل", titleEn: "Transportation Coordinator", category: "نقل", level: "entry", descriptionAr: "تنسيق عمليات النقل والجداول ومتابعة الموردين والسائقين.", skills: [["إدارة النقل", 5], ["الخدمات اللوجستية", 4], ["إدارة الوقت", 4], ["Microsoft Excel", 3]] }
  ];

  for (const j of saudiJobs) {
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
          create: (j.skills as [string, number][])
            .map(([name, importance]) => ({
              skillId: allSkillIdByName[name],
              importance
            }))
            .filter((x) => x.skillId)
        }
      }
    });
  }
  console.log(`✅ Extra jobs: ${saudiJobs.length}`);

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
