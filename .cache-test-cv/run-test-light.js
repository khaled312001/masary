// Lightweight test: minimal text inputs but full required fields + CV.
// Goal: keep total work under the 60s Vercel cap.
const fs = require("fs");
const path = require("path");

const BASE = "https://masary-five.vercel.app";
const CV_PATH = path.join(__dirname, "abdullah-cv.pdf");

async function main() {
  const cvBuffer = fs.readFileSync(CV_PATH);
  const blob = new Blob([cvBuffer], { type: "application/pdf" });

  const fd = new FormData();
  fd.set("fullName", "سارة الزهراني");
  fd.set("jobTitle", "محلل بيانات");
  fd.set("currentSkills", "SQL, Excel, Python");
  fd.set("cv", blob, "cv.pdf");

  console.log("Submitting light analyze to", BASE);
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
    console.log("body:", text.slice(0, 300));
    return;
  }
  console.log("response:", JSON.stringify(data));

  if (data.id) {
    const r = await fetch(`${BASE}/api/proxy/api/reports/${data.id}`);
    const rep = await r.json();
    console.log("\n--- TOKENS ---");
    console.log({
      inputTokens: rep.inputTokens,
      outputTokens: rep.outputTokens,
      totalTokens: rep.totalTokens,
      model: rep.claudeModel
    });
    console.log(`Report: ${BASE}/report/${data.id}`);
  }
}

main().catch((e) => console.error(e));
