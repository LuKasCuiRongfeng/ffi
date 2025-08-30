declare global {
    interface Window {
        ipcRenderer: {
            send: (channel: string, data: any) => void;
        };
    }
}

export {};