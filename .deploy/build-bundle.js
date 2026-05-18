// Builds a single tar.gz containing everything the server needs.
// Includes:
//   - server.js, package.json, deploy.sh        (deploy/)
//   - frontend/                                 (.next/standalone + .next/static + public)
//   - backend/src, prisma, package.json, tsconfig (built on server with native Prisma binary)

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const BACKEND_ROOT = path.resolve(ROOT, "..", "masary-backend");
const OUT_DIR = path.join(__dirname, "bundle");
const TAR = path.join(__dirname, "bundle.tar.gz");

function rm(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}
function mkdir(p) {
  fs.mkdirSync(p, { recursive: true });
}
function copy(src, dst) {
  if (!fs.existsSync(src)) {
    throw new Error("missing source: " + src);
  }
  fs.cpSync(src, dst, { recursive: true });
}

console.log("=== preparing bundle ===");
rm(OUT_DIR);
rm(TAR);
mkdir(OUT_DIR);
mkdir(path.join(OUT_DIR, "frontend"));
mkdir(path.join(OUT_DIR, "backend"));

// 1) deploy artifacts (root of nodejs/ dir)
copy(path.join(__dirname, "server.js"), path.join(OUT_DIR, "server.js"));
copy(path.join(__dirname, "package.json"), path.join(OUT_DIR, "package.json"));
copy(path.join(__dirname, "deploy.sh"), path.join(OUT_DIR, "deploy.sh"));

// 2) frontend — standalone build + static + public
copy(path.join(ROOT, ".next", "standalone"), path.join(OUT_DIR, "frontend"));
// standalone bundles server.js + node_modules already; we just need .next/static
//    and public dirs in the standalone tree as next docs specify.
mkdir(path.join(OUT_DIR, "frontend", ".next", "static"));
fs.rmSync(path.join(OUT_DIR, "frontend", ".next", "static"), { recursive: true, force: true });
copy(path.join(ROOT, ".next", "static"), path.join(OUT_DIR, "frontend", ".next", "static"));
if (fs.existsSync(path.join(ROOT, "public"))) {
  copy(path.join(ROOT, "public"), path.join(OUT_DIR, "frontend", "public"));
}

// 3) backend — source + prisma + configs (built on server)
copy(path.join(BACKEND_ROOT, "src"), path.join(OUT_DIR, "backend", "src"));
copy(path.join(BACKEND_ROOT, "prisma"), path.join(OUT_DIR, "backend", "prisma"));
copy(path.join(BACKEND_ROOT, "package.json"), path.join(OUT_DIR, "backend", "package.json"));
copy(path.join(BACKEND_ROOT, "package-lock.json"), path.join(OUT_DIR, "backend", "package-lock.json"));
copy(path.join(BACKEND_ROOT, "tsconfig.json"), path.join(OUT_DIR, "backend", "tsconfig.json"));

// 4) tarball
console.log("=== compressing ===");
// Use --force-local because the path contains a drive letter (`E:`) which
// GNU tar would otherwise treat as `host:path`.
const tar = spawnSync("tar", ["--force-local", "-czf", TAR, "-C", OUT_DIR, "."], { stdio: "inherit" });
if (tar.status !== 0) {
  console.error("tar failed");
  process.exit(1);
}
const size = fs.statSync(TAR).size;
console.log(`wrote ${TAR} (${(size / 1024 / 1024).toFixed(2)} MB)`);
