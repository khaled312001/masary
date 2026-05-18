// Unified entry point for the Hostinger Passenger Node.js app.
//
// Layout once deployed:
//   /home/.../domains/masaary.com/nodejs/
//     ├── server.js                    (this file)
//     ├── package.json                 (lists ALL deps for both apps)
//     ├── node_modules/
//     ├── prisma/                      (schema + generated client)
//     ├── backend/dist/                (tsc output of masary-backend)
//     └── frontend/                    (Next.js standalone build)
//         ├── server.js                (Next.js own entry, not used directly)
//         ├── .next/
//         ├── public/
//         └── package.json
//
// Behaviour:
//   1. Loads env vars from .env (one file, all keys).
//   2. Prepares Next.js (frontend dir).
//   3. Mounts the backend Express app as middleware so /api/{auth,analyze,
//      reports,skills,jobs,courses,companies,platforms,stats,settings,contact,
//      healthz} are handled by Express.
//   4. Everything else falls through to Next.js.
//   5. Listens on process.env.PORT (provided by Passenger).

"use strict";
const path = require("path");
const fs = require("fs");

// 1) Env. Load from project root .env (if present).
require("dotenv").config({ path: path.join(__dirname, ".env") });

const FRONTEND_DIR = path.join(__dirname, "frontend");
const BACKEND_APP_FILE = path.join(__dirname, "backend", "dist", "app.js");

// 2) Sanity checks — log clearly if a piece is missing so we can fix from the
// hPanel without redeploying.
if (!fs.existsSync(BACKEND_APP_FILE)) {
  console.error("FATAL: backend build missing at", BACKEND_APP_FILE);
  process.exit(1);
}
if (!fs.existsSync(path.join(FRONTEND_DIR, "server.js"))) {
  console.error("FATAL: Next.js standalone build missing at", FRONTEND_DIR);
  process.exit(1);
}

// 3) Prepare Next.js. Using the programmatic API so we can mount Express
// middleware before the catch-all.
const next = require(path.join(FRONTEND_DIR, "node_modules", "next"));
const express = require("express");

const nextApp = next({ dev: false, dir: FRONTEND_DIR, customServer: true });
const nextHandle = nextApp.getRequestHandler();

const { createApp: createBackendApp } = require(BACKEND_APP_FILE);
const backendApp = createBackendApp();

async function main() {
  await nextApp.prepare();

  const app = express();
  app.disable("x-powered-by");

  // Lightweight access log for production debugging.
  app.use((req, _res, nextMw) => {
    if (req.url.startsWith("/_next/") || req.url.startsWith("/favicon")) return nextMw();
    const t = Date.now();
    _res.on("finish", () => {
      // eslint-disable-next-line no-console
      console.log(`${req.method} ${req.url} ${_res.statusCode} ${Date.now() - t}ms`);
    });
    nextMw();
  });

  // Mount the Express backend first so /api/{analyze,reports,...} are served
  // directly without going through Next.js. The backend no longer adds a
  // catch-all 404, so unmatched requests fall through to Next.js below.
  app.use(backendApp);

  // Everything else → Next.js (pages, /api/admin/login, /api/proxy/[...], etc.)
  app.all("*", (req, res) => nextHandle(req, res));

  // 4) Listen on the port Passenger provides.
  const port = parseInt(process.env.PORT || "3000", 10);
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`masaary.com unified server listening on :${port}`);
  });
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
