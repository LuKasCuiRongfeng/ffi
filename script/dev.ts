#!/usr/bin/env node
import { build, BuildOptions } from "esbuild";
import { spawn } from "child_process";
import concurrently from "concurrently";
import chalk from "chalk";
import { resolve } from "path";
import chokidar from "chokidar";
import { log } from "./utils";

const root = process.cwd();

process.env.NODE_ENV = "development";

const esbuildOptions: BuildOptions = {
    entryPoints: [
        resolve(root, "src-main/main.ts"),
        resolve(root, "src-main/preload.ts"),
    ],
    bundle: true,
    platform: "node",
    target: "node18",
    format: "esm",
    outdir: resolve(root, "dist/main"),
    external: ["electron"],
    sourcemap: true,
};

let electronProc: ReturnType<typeof spawn>;

const startElectron = () => {
    if (electronProc) {
        log("electron", "restarting...");
        electronProc.kill();
        electronProc.removeAllListeners();
    }
    electronProc = spawn("electron", [resolve(root, "dist/main/main.js")], {
        stdio: "inherit",
        env: { ...process.env, NODE_ENV: "development" },
    });
    electronProc.once("close", (code) => {
        log("electron", `exited with ${code}`);
        process.exit(code ?? 0);
    });
};

/* ------------- 1. 主进程 + preload 首次打包 ------------- */
await build(esbuildOptions);
log("esbuild", "initial build done");

/* ------------- 2. esbuild watch ------------- */
chokidar
    .watch("src-main/**/*.ts", { ignoreInitial: true })
    .on("change", async () => {
        try {
            await build(esbuildOptions);
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
            command: "npx vite",
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
    { killOthersOn: ["failure", "success"] }
);
