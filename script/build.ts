#!/usr/bin/env node
import { build as viteBuild } from "vite";
import { spawn } from "child_process";
import { resolve } from "path";
import { buildMainProcess, log } from "./utils";

async function runBuild() {
    const root = process.cwd();
    process.env.NODE_ENV = "production";

    async function buildRenderer() {
        log("build", "start renderer (vite)...");
        await viteBuild({ configFile: resolve(root, "vite.config.ts") });
        log("build", "renderer done");
    }

    // 动态导入，避免运行dev中的顶层代码，如果使用静态import会导致dev中的顶层代码执行，我操
    // const buildMainProcess = await import("./dev").then((mod) => mod.buildMainProcess);

    // 并行执行
    await Promise.all([buildRenderer(), buildMainProcess()]);

    // 并行结束后统一打包安装包
    log("build", "start electron-builder...");
    spawn("npx", ["electron-builder"], {
        stdio: "inherit",
        cwd: root,
        shell: true, // 兼容windows,必须开启shell,否则找不到命令，而exec自动启用shell
    });
}

runBuild();
