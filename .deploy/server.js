// Unified entry point for the Hostinger Passenger Node.js app.
//
// Architecture (3 processes managed by this single Passenger entry):
//   1) Parent (this file) — listens on Passenger PORT, proxies traffic.
//   2) Backend child     — listens on BACKEND_PORT (default 4000).
//   3) Frontend child    — listens on FRONTEND_PORT (default 3010).
//
// Routing (parent):
//   /api/{auth,analyze,reports,skills,jobs,courses,companies,platforms,stats,
//          settings,contact,healthz}  →  backend child (4000)
//   everything else (incl. /api/admin/*, /api/proxy/*, /api/debug, pages)
//                                       →  frontend child (3010)
//
// Why 3 processes (vs. embedding backend as middleware)?
//   Passenger wraps the parent's listen() with its own socket layer, so a Node
//   process inside this container cannot reliably reach the parent's bound port
//   via loopback. Running each app on its own real TCP port avoids that.

"use strict";

const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const FRONTEND_DIR = path.join(__dirname, "frontend");
const FRONTEND_ENTRY = path.join(FRONTEND_DIR, "server.js");
const BACKEND_DIR = path.join(__dirname, "backend");
const BACKEND_ENTRY = path.join(BACKEND_DIR, "dist", "index.js");
const NODE_BIN = process.execPath;

const FRONTEND_PORT = parseInt(process.env.FRONTEND_PORT || "3010", 10);
const BACKEND_PORT = parseInt(process.env.BACKEND_PORT || "4000", 10);
const PASSENGER_PORT = parseInt(process.env.PORT || "3000", 10);

for (const p of [FRONTEND_ENTRY, BACKEND_ENTRY]) {
  if (!fs.existsSync(p)) {
    console.error("FATAL: missing", p);
    process.exit(1);
  }
}

const children = {};
function spawnChild(name, entry, cwd, port, extraEnv = {}) {
  if (children[name]) return;
  const child = spawn(NODE_BIN, [entry], {
    cwd,
    env: { ...process.env, ...extraEnv, PORT: String(port), HOSTNAME: "127.0.0.1" },
    stdio: ["ignore", "inherit", "inherit"]
  });
  children[name] = child;
  child.on("exit", (code, signal) => {
    console.error(`[${name}] exited code=${code} signal=${signal} — restarting in 2s`);
    delete children[name];
    setTimeout(() => spawnChild(name, entry, cwd, port, extraEnv), 2000);
  });
  child.on("error", (err) => console.error(`[${name}] spawn error:`, err.message));
}

function shutdown(signal) {
  return () => {
    console.log(`[parent] caught ${signal}`);
    for (const child of Object.values(children)) {
      try { child.kill(); } catch {}
    }
    setTimeout(() => process.exit(0), 500);
  };
}
process.on("SIGTERM", shutdown("SIGTERM"));
process.on("SIGINT", shutdown("SIGINT"));

// --- spawn children ---
spawnChild("backend", BACKEND_ENTRY, BACKEND_DIR, BACKEND_PORT);
spawnChild("frontend", FRONTEND_ENTRY, FRONTEND_DIR, FRONTEND_PORT, {
  // Frontend SSR + /api/proxy routes use this to reach the backend internally.
  API_URL: `http://127.0.0.1:${BACKEND_PORT}`,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://masaary.com"
});

// --- parent ---
const express = require("express");
const httpProxy = require("http-proxy");

const backendProxy = httpProxy.createProxyServer({
  target: `http://127.0.0.1:${BACKEND_PORT}`,
  proxyTimeout: 120000,
  timeout: 120000
});
const frontendProxy = httpProxy.createProxyServer({
  target: `http://127.0.0.1:${FRONTEND_PORT}`,
  ws: true,
  proxyTimeout: 120000,
  timeout: 120000
});

function proxyErrorHandler(name) {
  return (err, req, res) => {
    console.error(`[${name} proxy] error:`, err.message, "for", req?.url);
    if (res && !res.headersSent) {
      res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(`الخدمة (${name}) مؤقتاً غير متاحة. حاول مرة أخرى.`);
    }
  };
}
backendProxy.on("error", proxyErrorHandler("backend"));
frontendProxy.on("error", proxyErrorHandler("frontend"));

// Paths handled by the Next.js frontend (everything else under /api/* is backend).
const NEXTJS_API_PREFIXES = [
  "/api/admin/",
  "/api/proxy/",
  "/api/debug",
  "/api/debug-auth"
];

function isNextjsApi(url) {
  const p = url.split("?")[0];
  return NEXTJS_API_PREFIXES.some((prefix) => p === prefix.replace(/\/$/, "") || p.startsWith(prefix));
}

const app = express();
app.disable("x-powered-by");

app.use((req, res) => {
  const url = req.url;
  if (url.startsWith("/api/") && !isNextjsApi(url)) {
    backendProxy.web(req, res);
  } else {
    frontendProxy.web(req, res);
  }
});

const httpServer = app.listen(PASSENGER_PORT, () => {
  console.log(`masaary unified: parent :${PASSENGER_PORT}, backend :${BACKEND_PORT}, frontend :${FRONTEND_PORT}`);
});
httpServer.on("upgrade", (req, socket, head) => frontendProxy.ws(req, socket, head));
