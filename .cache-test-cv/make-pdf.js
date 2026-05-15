// Tiny hand-crafted PDF builder so we can submit a realistic CV without
// pulling in a dependency. The content is plain ASCII text that pdf-parse
// can extract on the backend.

const fs = require("fs");
const path = require("path");

function buildPdf(lines) {
  const fontObj = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  const textStream = [
    "BT",
    "/F1 12 Tf",
    "50 760 Td",
    ...lines.flatMap((line, i) => [
      `(${line.replace(/([\\()])/g, "\\$1")}) Tj`,
      i === lines.length - 1 ? null : "0 -18 Td"
    ]).filter(Boolean),
    "ET"
  ].join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    fontObj,
    `<< /Length ${Buffer.byteLength(textStream)} >>\nstream\n${textStream}\nendstream`
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [];
  objects.forEach((body, i) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (const o of offsets) pdf += `${String(o).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf, "binary");
}

const cv = buildPdf([
  "Abdullah Al-Otaibi - Curriculum Vitae",
  "Email: abdullah@example.com  |  Phone: +966 50 000 0000",
  "Riyadh, Saudi Arabia",
  "",
  "Profile",
  "Data analyst with 3 years of experience supporting finance teams across",
  "telecom and banking. Strong in SQL, Excel modeling, and Python for ETL.",
  "Communication and stakeholder management in Arabic and English.",
  "",
  "Experience",
  "STC - Data Analyst (2023 - present)",
  "  - Built dashboards in Power BI for revenue and churn",
  "  - Automated monthly reporting using Python and SQL",
  "  - Reduced reconciliation time by 40 percent",
  "",
  "Al Rajhi Bank - Junior Analyst (2021 - 2023)",
  "  - SQL queries on Oracle for compliance reporting",
  "  - Excel pivot models for credit risk dashboards",
  "",
  "Education",
  "King Saud University - BSc Statistics (2017 - 2021)",
  "",
  "Skills",
  "SQL, Python, Power BI, Excel, ETL, Data Visualization, Communication,",
  "Stakeholder Management, Financial Analysis, Arabic, English",
  "",
  "Certifications",
  "Google Data Analytics Professional Certificate (Coursera)",
  "Microsoft Power BI Data Analyst Associate (Microsoft Learn)"
]);

const out = path.join(__dirname, "abdullah-cv.pdf");
fs.writeFileSync(out, cv);
console.log("wrote", out, cv.length, "bytes");
