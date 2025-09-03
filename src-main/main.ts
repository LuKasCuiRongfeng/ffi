import { app, BrowserWindow, ipcMain } from "electron";
import path, { resolve } from "path";
import koffi from "koffi";
// import { fibonacci, add } from "../native/index"
import { createRequire } from "module";

let win: BrowserWindow | null = null;

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(import.meta.dirname, "preload.js"),
        },
    });

    const isDev = process.env.NODE_ENV === "development";
    if (isDev) {
        win.loadURL("http://localhost:3000");
    } else {
        win.loadFile(path.join(import.meta.dirname, "../render/index.html"));
    }
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());

ipcMain.on("test", () => {
    // console.log(arg); // prints "ping"
    // event.reply("test", "pong");

    // const handle = win?.getNativeWindowHandle().readInt32LE();

    // // Declare constants
    // const MB_OK = 0x0;
    // const MB_YESNO = 0x4;
    // const MB_ICONQUESTION = 0x20;
    // const MB_ICONINFORMATION = 0x40;
    // const IDOK = 1;
    // const IDYES = 6;
    // const IDNO = 7;

    // const user32 = koffi.load("user32.dll");
    // const MessageBoxA = user32.func("MessageBoxA", "int", [
    //     "void *",
    //     "str",
    //     "str",
    //     "uint",
    // ]);
    // const MessageBoxW = user32.func("__stdcall", "MessageBoxW", "int", [
    //     "void *",
    //     "str16",
    //     "str16",
    //     "uint",
    // ]);
    // const res = MessageBoxA(
    //     handle,
    //     "Hello Worhgfgsdfa",
    //     "Title",
    //     MB_YESNO | MB_ICONQUESTION,
    // );

    // if (res == IDYES) {
    //     MessageBoxW(null, 'Hello World!', 'Koffi', MB_ICONINFORMATION);
    // } else {
    //     console.log("NO");
    // }

    // const lib = koffi.load(resolve(import.meta.dirname, "../native/hello.dll"));
    // const add = lib.func("int add(int a, int b)");

    const lib = koffi.load(
        resolve(import.meta.dirname, "../native/fibonacci.dll"),
    );
    const cfi = lib.func("long long fibonacci(uint n)");

    const rustlib = koffi.load(
        resolve(import.meta.dirname, "../native/rust_dll.dll"),
    );
    const rustFibonacci = rustlib.func("long long fib(uint n)");

    const fi = (n: number) => {
        if (n <= 1) return 1;

        return fi(n - 1) + fi(n - 2);
    };

    const require = createRequire(import.meta.url);
    const { fibonacci, add: rsAdd } = require("../native/index.node");
    console.log(rsAdd(1, 2));
    console.time("rust_node fibonacci");
    console.log(fibonacci(45));
    console.timeEnd("rust_node fibonacci");

    console.time("js fibonacci");
    console.log(fi(45));
    console.timeEnd("js fibonacci");

    console.time("c_dll fibonacci");
    console.log(cfi(45));
    console.timeEnd("c_dll fibonacci");

    console.time("rust_dll fibonacci");
    console.log(rustFibonacci(45));
    console.timeEnd("rust_dll fibonacci");
});
