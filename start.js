import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendDir = path.join(__dirname, "backend");
const frontendDir = path.join(__dirname, "frontend");

const isWin = process.platform === "win32";
const npmCmd = isWin ? "npm.cmd" : "npm";

console.log("\x1b[1m\x1b[35m=================================================");
console.log("  🌸 SCENTSAMPLE NEPAL — MERN SYSTEM RUNNER 🌸  ");
console.log("=================================================\x1b[0m");
console.log("🚀 Backend API:  http://localhost:8000");
console.log("💻 Frontend UI:   http://localhost:5173");
console.log("🛑 Press Ctrl+C anytime to stop both servers\n");

// 1. Launch Express Backend
const backend = spawn("node", ["index.js"], {
  cwd: backendDir,
  shell: true,
  stdio: "inherit",
});

// 2. Launch Vite React Frontend
const frontend = spawn(npmCmd, ["run", "dev"], {
  cwd: frontendDir,
  shell: true,
  stdio: "inherit",
});

const cleanup = () => {
  console.log("\n\x1b[31m🛑 Shutting down backend and frontend...\x1b[0m");
  if (isWin) {
    if (backend.pid) spawn("taskkill", ["/pid", backend.pid.toString(), "/f", "/t"]);
    if (frontend.pid) spawn("taskkill", ["/pid", frontend.pid.toString(), "/f", "/t"]);
  } else {
    backend.kill();
    frontend.kill();
  }
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

backend.on("close", (code) => {
  console.log(`Backend process exited with code ${code}`);
});

frontend.on("close", (code) => {
  console.log(`Frontend process exited with code ${code}`);
});
