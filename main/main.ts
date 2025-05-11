import { app, BrowserWindow, ipcMain } from "electron";
import { VM } from "vm2";
import { dialog } from "electron";
import { autoUpdater } from "electron-updater";
import { machineIdSync } from "node-machine-id";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import axios from "axios";

app.setName("CosmoJS");
app.setAppUserModelId("com.cosmoframeworks.cosmojs");

const licPath = path.join(app.getPath("userData"), "license.json");
const PUB_KEY = fs.readFileSync(path.join(__dirname, "../assets/pub.pem"));
const machineId = machineIdSync(true);

const isDev = !app.isPackaged;
const gotTheLock = app.requestSingleInstanceLock();

let mainWindow: BrowserWindow;
let splashWindow: BrowserWindow;

function createWindow() {
  splashWindow = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    center: true,
    resizable: false,
    skipTaskbar: true,
    icon: path.join(__dirname, "../assets/app-icon.ico"),
  });

  splashWindow.loadFile(path.join(__dirname, "../assets/splash.html"));

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 680,
    minWidth: 940,
    minHeight: 560,
    frame: false,
    titleBarStyle: "hidden",
    icon: path.join(__dirname, "../assets/app-icon.png"),
    show: false,
    webPreferences: {
      devTools: isDev,
      preload: path.join(__dirname, "../preload/preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow
      .loadFile(path.join(__dirname, "../../renderer/dist/index.html"))
      .catch((err) => {
        console.error("Error cargando la app:", err);
      });
  }

  mainWindow.once("ready-to-show", () => {
    setTimeout(() => {
      if (splashWindow) {
        splashWindow.close();
      }
      mainWindow.show();
    }, 4000);
  });
}

// Control de instancia única
if (!gotTheLock) {
  app.quit();
} else {
  app.whenReady().then(() => {
    createWindow();

    if (!isDev) {
      autoUpdater.checkForUpdatesAndNotify();
    }

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

//Eventos de actualización automática
autoUpdater.on("update-available", () => {
  mainWindow.webContents.send("update-available");
});

autoUpdater.on("update-downloaded", () => {
  console.log("Update descargada, lista para instalar");
  if (mainWindow) {
    mainWindow.webContents.send("update-available");
  }
});

autoUpdater.on("download-progress", (progressObj) => {
  if (mainWindow) {
    mainWindow.webContents.send(
      "update-download-progress",
      progressObj.percent
    );
  }
});

ipcMain.on("install-update", () => {
  autoUpdater.quitAndInstall();
});

//IPC Para manejar archivos
ipcMain.handle("import-file", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [{ name: "Archivos", extensions: ["js"] }],
    properties: ["openFile"],
  });

  if (canceled || filePaths.length === 0) return null;

  const filePath = filePaths[0];
  const content = fs.readFileSync(filePath, "utf-8");
  const name = path.basename(filePath);
  return { code: content, name };
});

ipcMain.handle("export-file", async (_event, code: string) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: "Guardar código como archivo",
    defaultPath: "codigo.js",
    filters: [{ name: "Archivos JS", extensions: ["js"] }],
  });

  if (canceled || !filePath) return;

  fs.writeFileSync(filePath, code, "utf-8");
});

//IPC para ejecutar código seguro
ipcMain.handle("run-code", async (_e, code: string) => {
  const serialize = (value: any, seen = new WeakMap()): any => {
    if (value === null || typeof value !== "object") {
      if (typeof value === "function")
        return `[Function ${value.name || "anonymous"}]`;
      return value; // primitivos OK
    }
    if (seen.has(value)) return "[Circular]"; // corta ciclos
    seen.set(value, true);

    // Tipos built‑in
    if (value instanceof Date)
      return { __type: "Date", value: value.toISOString() };
    if (value instanceof RegExp)
      return { __type: "RegExp", value: value.toString() };
    if (value instanceof Map) {
      return {
        __type: "Map",
        value: Array.from(value.entries()).map(([k, v]) => [
          serialize(k, seen),
          serialize(v, seen),
        ]),
      };
    }
    if (value instanceof Set) {
      return {
        __type: "Set",
        value: Array.from(value).map((v) => serialize(v, seen)),
      };
    }
    if (ArrayBuffer.isView(value)) {
      return {
        __type: value.constructor.name,
        value: Array.from(value as any),
      };
    }

    // Objetos / arrays normales
    const out: any = Array.isArray(value) ? [] : {};
    Reflect.ownKeys(value).forEach((k) => {
      out[k as any] = serialize((value as any)[k], seen);
    });
    return out;
  };

  try {
    const logs: any[] = [];

    const vm = new VM({
      timeout: 1_000,
      sandbox: {
        console: {
          log: (...args: any[]) => logs.push(...args.map((a) => serialize(a))),
        },
      },
    });

    const result = vm.run(`(function () { ${code} })()`);

    return {
      logs,
      result: result === undefined ? undefined : serialize(result),
      error: null,
    };
  } catch (err) {
    return { logs: [], result: null, error: String(err) };
  }
});

// IPC para controlar la ventana
ipcMain.on("window:minimize", () => {
  BrowserWindow.getFocusedWindow()?.minimize();
});

ipcMain.on("window:maximize", () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win?.isMaximized()) {
    win.unmaximize();
  } else {
    win?.maximize();
  }
});

ipcMain.on("window:close", () => {
  BrowserWindow.getFocusedWindow()?.close();
});

//IPC Para controlar la licencia
ipcMain.handle("license:get", async () => {
  if (!fs.existsSync(licPath)) return null;
  const token = fs.readFileSync(licPath, "utf-8");

  try {
    return jwt.verify(token, PUB_KEY, { algorithms: ["RS256"] });
  } catch {
    return null;
  }
});

ipcMain.handle("license:activate", async (_e, key: string) => {
  const { data } = await axios.post(
    "htts://api.shakarzr.com/api/licenses/activate",
    {
      key,
      machineId,
    }
  );

  if (!data.token) return null;
  fs.writeFileSync(licPath, data.token, "utf-8");
  return jwt.verify(data.token, PUB_KEY);
});

ipcMain.handle("license:remove", async () => {
  if (fs.existsSync(licPath)) fs.unlinkSync(licPath);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
