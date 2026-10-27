import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Connect, Plugin } from "vite";

/** Same file Studio mounts and renders as /env.js. */
export function consoleEnvPath(): string {
  return path.join(os.homedir(), ".apito", "bin", ".env.console");
}

export function loadConsoleEnv(): Record<string, string> {
  const homeFile = consoleEnvPath();
  const repoFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.env");
  const file = fs.existsSync(homeFile) ? homeFile : repoFile;
  if (!fs.existsSync(file)) {
    throw new Error(
      `Missing ${homeFile}. Run apito start once so it can write the console env.`,
    );
  }

  const env: Record<string, string> = {};
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
    process.env[key] = value;
  }
  return env;
}

export function renderEnvJs(env: Record<string, string>): string {
  const lines = ["window.env = {"];
  for (const [key, value] of Object.entries(env)) {
    lines.push(`  ${key}: ${JSON.stringify(value)},`);
  }
  lines.push("};", "");
  return lines.join("\n");
}

/** Serves ~/.apito/bin/.env.console at /env.js, the same file Studio renders. */
export function apitoConsoleEnvPlugin(): Plugin {
  const body = renderEnvJs(loadConsoleEnv());
  const serve: Connect.NextHandleFunction = (_req, res, next) => {
    const url = _req.url?.split("?")[0];
    if (url !== "/env.js") return next();
    res.setHeader("Content-Type", "application/javascript");
    res.setHeader("Cache-Control", "no-store");
    res.end(body);
  };

  return {
    name: "apito-console-env",
    configureServer(server) {
      server.middlewares.use(serve);
    },
    configurePreviewServer(server) {
      server.middlewares.use(serve);
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "env.js", source: body });
    },
  };
}
