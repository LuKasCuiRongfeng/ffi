import { spawn, SpawnOptions } from "child_process";
import chalk from "chalk";
import { build } from "esbuild";
import { resolve } from "path";

export function log(label: string, msg: string) {
    console.log(`${chalk.cyan(`[${label}]`)} ${msg}`);
}

export function run(
    command: string,
    args: string[] = [],
    opts: SpawnOptions = {}
) {
    return new Promise<void>((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: "inherit",
            shell: true,
            ...opts,
        });
        child.on("close", (code) =>
            code === 0 ? resolve() : reject(new Error(`exit ${code}`))
        );
    });
}

export async function buildMainProcess(dev?: boolean) {
    const root = process.cwd();
    await build({
        entryPoints: [resolve(root, "src-main/main.ts")],
        bundle: true,
        platform: "node",
        target: "node18",
        // electron >=28 支持 esm 格式
        format: "esm",
        outdir: resolve(root, "dist/main"),
        external: ["electron", "koffi"],
        sourcemap: dev ? true : false,
        minify: dev ? false : true,
    });

    await build({
        entryPoints: [resolve(root, "src-main/preload.ts")],
        bundle: true,
        platform: "node",
        target: "node18",
        // electron 沙盒环境下，preload脚本目前必须要求 cjs，不支持 esm
        format: "cjs",
        outdir: resolve(root, "dist/main"),
        external: ["electron", "koffi"],
        sourcemap: dev ? true : false,
        minify: dev ? false : true,
    });
}
