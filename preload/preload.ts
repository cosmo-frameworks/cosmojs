import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  runCode: (code: string) =>
    ipcRenderer.invoke("run-code", code) as Promise<{
      logs: any[];
      result: any;
      error: string | null;
    }>,
  send: (channel: string, data?: any) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (_, ...args) => callback(...args));
  },
  off: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, callback);
  },
  importFile: () => ipcRenderer.invoke("import-file"),
  exportFile: (code: string) => ipcRenderer.invoke("export-file", code),
  activateLicense: (key: string) => ipcRenderer.invoke("license:activate", key),
  getStoredLicense: () => ipcRenderer.invoke("license:get"),
  removeLicense: () => ipcRenderer.invoke("license:remove"),
  windowControls: {
    minimize: () => ipcRenderer.send("window:minimize"),
    maximize: () => ipcRenderer.send("window:maximize"),
    close: () => ipcRenderer.send("window:close"),
  },
});
