const BASE = "https://masary-five.vercel.app";

async function main() {
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

  console.log("Submitting analyze (no CV) to", BASE);
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

  const reportRes = await fetch(`${BASE}/api/proxy/api/reports/${data.id}`);
  const report = await reportRes.json();
  console.log("---NO-CV REPORT USAGE---");
  console.log({
    id: report.id,
    inputTokens: report.inputTokens,
    outputTokens: report.outputTokens,
    totalTokens: report.totalTokens,
    claudeModel: report.claudeModel,
    matchScore: report.data?.matchScore,
    learningPathSteps: report.data?.learningPath?.length
  });
  console.log(`Report: ${BASE}/report/${data.id}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
