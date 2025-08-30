#!/usr/bin/env node
import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { spawn } from "child_process";
import { resolve } from "path";
import { log } from "./utils";

const root = process.cwd();

process.env.NODE_ENV = "production";
async function buildRenderer() {
    log("build", "start renderer (vite)...");
    await viteBuild({ configFile: resolve(root, "vite.config.ts") });
    log("build", "renderer done");
}

async function buildMainProcess() {
    log("build", "start main process (esbuild)...");
    await esbuild({
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
        minify: true,
        sourcemap: false,
    });
    log("build", "main process done");
}

// 并行执行
await Promise.all([buildRenderer(), buildMainProcess()]);

// 并行结束后统一打包安装包
log("build", "start electron-builder...");
spawn("npx", ["electron-builder"], {
    stdio: "inherit",
    cwd: root,
    shell: true,
});

// exec('npx electron-builder', { cwd: root });
