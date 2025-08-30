import { spawn, SpawnOptions } from "child_process";
import chalk from "chalk";

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
