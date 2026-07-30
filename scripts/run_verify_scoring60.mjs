/**
 * Compiles and runs scripts/verify_scoring60.ts.
 *
 * The scoring module is written for the Next bundler, so two things need doing
 * before plain node can execute it: emit CommonJS, and teach `require` how to
 * resolve the "@/" path alias. Both happen here.
 *
 * Usage:  node scripts/run_verify_scoring60.mjs
 */
import { spawnSync } from "node:child_process";
import { existsSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJECT = resolve(HERE, "..");
const OUT = resolve(PROJECT, ".verify-out");
const TSC = resolve(PROJECT, "node_modules", "typescript", "bin", "tsc");

rmSync(OUT, { recursive: true, force: true });

const build = spawnSync(process.execPath, [TSC, "-p", "tsconfig.verify.json"], {
  cwd: PROJECT, encoding: "utf8",
});
if (build.stdout?.trim()) console.log(build.stdout.trim());
if (build.stderr?.trim()) console.error(build.stderr.trim());
if (build.status !== 0) { console.error("compile failed"); process.exit(build.status ?? 1); }

// Resolve "@/..." against the project root, the way the bundler does.
const HOOK = resolve(OUT, "_alias.cjs");
writeFileSync(HOOK, `
const Module = require("module");
const path = require("path");
const ROOT = ${JSON.stringify(OUT)};
const orig = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request.startsWith("@/")) {
    const rel = request.slice(2);
    // .json assets are not emitted by tsc — read them from the real source tree.
    if (rel.endsWith(".json")) return path.join(${JSON.stringify(PROJECT)}, rel);
    return orig.call(this, path.join(ROOT, rel), ...rest);
  }
  return orig.call(this, request, ...rest);
};
`);

const entry = resolve(OUT, "scripts", "verify_scoring60.js");
if (!existsSync(entry)) { console.error(`missing ${entry}`); process.exit(1); }

const run = spawnSync(process.execPath, ["-r", HOOK, entry], { cwd: PROJECT, stdio: "inherit" });
rmSync(OUT, { recursive: true, force: true });
process.exit(run.status ?? 1);
