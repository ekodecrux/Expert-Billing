// Production entry file for cloud hosting (Hostinger, cPanel, Render, Railway, etc.)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distServer = path.join(__dirname, "dist", "server.cjs");

if (!fs.existsSync(distServer)) {
  console.log("[server.js] Production build not found. Running npm run build...");
  const { execSync } = await import("node:child_process");
  execSync("npm run build", { stdio: "inherit" });
}

await import("./dist/server.cjs");
