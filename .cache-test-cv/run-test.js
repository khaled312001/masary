const fs = require("fs");
const path = require("path");

const BASE = "https://masary-five.vercel.app";
const CV_PATH = path.join(__dirname, "abdullah-cv.pdf");

async function main() {
  const cvBuffer = fs.readFileSync(CV_PATH);
  const blob = new Blob([cvBuffer], { type: "application/pdf" });

  const fd = new FormData();
  fd.set("fullName", "عبدالله العتيبي");
  fd.set("jobTitle", "مهندس بيانات");
  fd.set("employer", "أرامكو");
  fd.set(
    "currentSkills",
    "SQL, Python, Power BI, Excel, تحليل البيانات, التواصل الفعّال, اللغة الإنجليزية, إدارة أصحاب المصلحة"
  );
  fd.set(
    "currentCourses",
    "Google Data Analytics Professional Certificate, Microsoft Power BI Data Analyst Associate"
  );
  fd.set("cv", blob, "abdullah-cv.pdf");

  console.log("Submitting analyze request to", BASE);
  const t0 = Date.now();
  const res = await fetch(`${BASE}/api/proxy/api/analyze`, {
    method: "POST",
    body: fd
  });
  const elapsed = Date.now() - t0;
  const text = await res.text();
  console.log(`status=${res.status} elapsed=${(elapsed / 1000).toFixed(1)}s`);
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.log("body (raw):", text.slice(0, 800));
    process.exit(1);
  }
  console.log("response:", JSON.stringify(data, null, 2));

  if (!res.ok || !data.id) {
    console.error("FAILED");
    process.exit(1);
  }

  // Now fetch the saved report to read token usage
  const reportRes = await fetch(`${BASE}/api/proxy/api/reports/${data.id}`);
  const report = await reportRes.json();
  console.log("---REPORT USAGE---");
  console.log({
    id: report.id,
    fullName: report.fullName,
    jobTitle: report.jobTitle,
    inputTokens: report.inputTokens,
    outputTokens: report.outputTokens,
    totalTokens: report.totalTokens,
    claudeModel: report.claudeModel,
    matchScore: report.data?.matchScore,
    presentSkills: report.data?.presentSkills?.length,
    missingSkills: report.data?.missingSkills?.length,
    partialSkills: report.data?.partialSkills?.length,
    learningPathSteps: report.data?.learningPath?.length,
    suggestedCourses: report.data?.suggestedCourses?.length,
    suggestedEmployers: report.data?.suggestedEmployers?.length,
    createdAt: report.createdAt
  });
  console.log(`\nReport URL: ${BASE}/report/${data.id}`);
}

main().catch((e) => {
  console.error("error:", e);
  process.exit(1);
});
