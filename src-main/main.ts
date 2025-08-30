import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import koffi from "koffi";

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(import.meta.dirname, "preload.js"),
        },
    });

    const isDev = process.env.NODE_ENV === "development";
    console.log("isDev", isDev);
    if (isDev) {
        win.loadURL("http://localhost:3000");
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(import.meta.dirname, "../render/index.html"));
    }
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());

ipcMain.on("test", (event, arg) => {
    console.log(arg); // prints "ping"
    event.reply("test", "pong");

    const user32 = koffi.load("user32.dll");
    const MessageBoxA = user32.func("MessageBoxA", "int", [
        "void *",
        "str",
        "str",
        "uint",
    ]);
    MessageBoxA(null, "Hello Worhgfgsdfa", "Title", 0);
});
