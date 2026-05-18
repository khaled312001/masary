// Standalone backend entry used for local dev (npm run dev) and CLI startup.
// In the Hostinger deployment the backend is mounted as middleware inside the
// unified server.js — see ../../deploy/server.js.
import app from "./app";

app.get("/", (_req, res) => {
  res.json({ name: "masary-backend", version: "1.0.0", status: "ok" });
});

app.use((_req, res) => {
  res.status(404).json({ error: "المسار غير موجود" });
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Masary backend listening on http://localhost:${PORT}`);
});
