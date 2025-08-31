#!/usr/bin/env node
import { spawn } from "child_process";
import concurrently from "concurrently";
import chalk from "chalk";
import { resolve } from "path";
import chokidar from "chokidar";
import { buildMainProcess, log } from "./utils";

async function runDev() {
    const root = process.cwd();
    process.env.NODE_ENV = "development";

    let electronProc: ReturnType<typeof spawn>;

    function startElectron() {
        if (electronProc) {
            log("electron", "restarting...");
            electronProc.kill();
            electronProc.removeAllListeners();
        }
        electronProc = spawn("electron", [resolve(root, "dist/main/main.js")], {
            stdio: "inherit",
            env: { ...process.env, NODE_ENV: "development" },
            shell: true,
        });
        electronProc.once("close", (code) => {
            log("electron", `exited with ${code}`);
            process.exit(code ?? 0);
        });
    }

    /* ------------- 1. 主进程 + preload 首次打包 ------------- */
    await buildMainProcess(true);
    log("esbuild", "initial build done");

    /* ------------- 2. esbuild watch ------------- */
    chokidar
        .watch(resolve(root, "src-main"), { ignoreInitial: true })
        .on("change", async () => {
            try {
                await buildMainProcess(true);
                log("esbuild", "rebuild success");
                startElectron(); // 重新拉起 Electron
            } catch (e) {
                log("esbuild", chalk.red(String(e)));
            }
        });

    /* ------------- 3. 并行任务 ------------- */
    concurrently(
        [
            {
                command: "npx vite", // vite 收到 SIGTERM 信号后会自动退出
                name: "vite",
                prefixColor: "blue",
            },
            {
                command:
                    "npx wait-on http://localhost:3000 && electron dist/main/main.js",
                name: "electron",
                prefixColor: "green",
            },
        ],
        { killOthersOn: ["failure", "success"] },
    );
}

runDev();
