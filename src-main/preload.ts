import { contextBridge, ipcRenderer } from "electron";

// 当前preload脚本在沙盒环境下必须打包成 cjs 格式，不支持 esm

contextBridge.exposeInMainWorld("ipcRenderer", {
    send: (channel: string, data: any) => ipcRenderer.send(channel, data),
});
