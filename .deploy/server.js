// Unified entry point for the Hostinger Passenger Node.js app.
//
//   /home/.../domains/masaary.com/nodejs/
//     ├── server.js                    (this file — Passenger entry)
//     ├── package.json
//     ├── node_modules/                (express, http-proxy, dotenv, prisma, etc.)
//     ├── .env
//     ├── prisma/                      (schema lives inside backend/)
//     ├── backend/                     (Express + Prisma, compiled to dist/)
//     │   ├── src/  prisma/  package.json  tsconfig.json  dist/
//     │   └── node_modules/
//     └── frontend/                    (Next.js standalone)
//         ├── server.js                (Next.js own — spawned as child)
//         ├── .next/  public/  package.json  node_modules/
//
// Behaviour:
//   1) Load env from .env (using dotenv).
//   2) Spawn frontend/server.js as child on FRONTEND_PORT (default 3010, internal).
//   3) Start an Express server on PORT (Passenger-provided):
//        - mount backend Express app at root → handles /api/{analyze,reports,...}
//        - everything unmatched is proxied to the frontend child.
//   4) Frontend child auto-restart if it dies.

"use strict";

const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const FRONTEND_DIR = path.join(__dirname, "frontend");
const FRONTEND_ENTRY = path.join(FRONTEND_DIR, "server.js");
const BACKEND_APP_FILE = path.join(__dirname, "backend", "dist", "app.js");
const NODE_BIN = process.execPath;

const FRONTEND_PORT = parseInt(process.env.FRONTEND_PORT || "3010", 10);

if (!fs.existsSync(FRONTEND_ENTRY)) {
  console.error("FATAL: missing", FRONTEND_ENTRY);
  process.exit(1);
}
if (!fs.existsSync(BACKEND_APP_FILE)) {
  console.error("FATAL: missing", BACKEND_APP_FILE);
  process.exit(1);
}

let frontendChild = null;
let restartTimer = null;

function startFrontend() {
  frontendChild = spawn(NODE_BIN, [FRONTEND_ENTRY], {
    cwd: FRONTEND_DIR,
    env: {
      ...process.env,
      PORT: String(FRONTEND_PORT),
      HOSTNAME: "127.0.0.1",
      // Frontend's own API_URL points to THIS process so its server-side
      // fetches loop back through the same Express on the public port.
      // We rely on /api/proxy/[...] which uses this.
      API_URL: `http://127.0.0.1:${process.env.PORT || "3000"}`
    },
    stdio: ["ignore", "inherit", "inherit"]
  });
  frontendChild.on("exit", (code, signal) => {
    console.error(`[frontend] exited code=${code} signal=${signal} — restarting in 2s`);
    frontendChild = null;
    if (restartTimer) clearTimeout(restartTimer);
    restartTimer = setTimeout(startFrontend, 2000);
  });
  frontendChild.on("error", (err) => {
    console.error("[frontend] spawn error:", err.message);
  });
}

function shutdown(signal) {
  return () => {
    console.log(`[parent] caught ${signal} — shutting down`);
    if (frontendChild) {
      try { frontendChild.kill(); } catch {}
    }
    process.exit(0);
  };
}
process.on("SIGTERM", shutdown("SIGTERM"));
process.on("SIGINT", shutdown("SIGINT"));

// --- main ---
startFrontend();

const express = require("express");
const httpProxy = require("http-proxy");

const { createApp: createBackendApp } = require(BACKEND_APP_FILE);
const backendApp = createBackendApp();

const proxy = httpProxy.createProxyServer({
  target: `http://127.0.0.1:${FRONTEND_PORT}`,
  changeOrigin: false,
  ws: true,
  proxyTimeout: 120000,
  timeout: 120000
});
proxy.on("error", (err, req, res) => {
  console.error("[proxy] error:", err.message, "for", req?.url);
  if (res && !res.headersSent) {
    res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("الواجهة الأمامية مؤقتاً غير متاحة. حاول مرة أخرى.");
  }
});

const app = express();
app.disable("x-powered-by");

// Backend Express handles /api/{auth,analyze,reports,skills,jobs,courses,
// companies,platforms,stats,settings,contact,healthz}.
// It no longer has its own 404 catch-all (see backend/src/app.ts), so unmatched
// /api/* requests fall through to Next.js too (handles /api/admin/login,
// /api/proxy/[...], /api/debug etc.).
app.use(backendApp);

// Everything else → frontend child via HTTP proxy.
app.all("*", (req, res) => {
  proxy.web(req, res);
});

const port = parseInt(process.env.PORT || "3000", 10);
const httpServer = app.listen(port, () => {
  console.log(`masaary unified server: parent listening on :${port}, frontend on :${FRONTEND_PORT}`);
});

// WebSocket upgrade passthrough for HMR (only relevant if dev mode is ever used).
httpServer.on("upgrade", (req, socket, head) => {
  proxy.ws(req, socket, head);
});
