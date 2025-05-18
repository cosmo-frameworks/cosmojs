import {
  app,
  BrowserWindow,
  ipcMain,
  IpcMainInvokeEvent,
  shell,
} from "electron";
import { VM, NodeVM } from "vm2";
import { dialog } from "electron";
import { autoUpdater } from "electron-updater";
import { machineIdSync } from "node-machine-id";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import axios from "axios";

const licPath = path.join(app.getPath("userData"), "license.json");
const PUB_KEY = fs.readFileSync(path.join(__dirname, "../assets/pub.pem"));
const machineId = machineIdSync(true);

const isDev = !app.isPackaged;
const gotTheLock = app.requestSingleInstanceLock();

let mainWindow: BrowserWindow;
let splashWindow: BrowserWindow;

type LogLevel = "log" | "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  data: unknown[];
}

interface RunResult {
  result: unknown | null;
  error: Error | null;
}

interface RunCodeResponse {
  logs: LogEntry[];
  result: unknown | null;
  error: {
    __type: "Error";
    name: string;
    message: string;
    stack?: string;
  } | null;
}

function serialize(value: unknown, seen = new WeakSet<object>()): unknown {
  if (value === null || typeof value !== "object") {
    if (typeof value === "bigint") {
      return value.toString() + "n";
    }
    if (typeof value === "symbol") {
      return `Symbol(${(value as symbol).description ?? ""})`;
    }
    if (typeof value === "function") {
      return `[Function ${(value as Function).name || "anonymous"}]`;
    }
    return value;
  }

  if (seen.has(value as object)) return "[Circular]";
  seen.add(value as object);

  if (value instanceof Error) {
    return {
      __type: "Error" as const,
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  // Colecciones y tipos especiales
  if (value instanceof Map) {
    return {
      __type: "Map" as const,
      value: Array.from(value.entries()).map(([k, v]) => [
        serialize(k, seen),
        serialize(v, seen),
      ]),
    };
  }

  if (value instanceof Set) {
    return {
      __type: "Set" as const,
      value: Array.from(value).map((v) => serialize(v, seen)),
    };
  }

  if (value instanceof Date) {
    return { __type: "Date" as const, value: value.toISOString() };
  }

  if (value instanceof RegExp) {
    return { __type: "RegExp" as const, value: value.toString() };
  }

  const typed = value as unknown as ArrayLike<unknown>;
  if (ArrayBuffer.isView(value)) {
    return {
      __type: value.constructor.name as string,
      value: Array.from(typed),
    };
  }

  // Objetos y arrays genéricos
  const out: Record<string, unknown> | unknown[] = Array.isArray(value)
    ? []
    : {};
  Reflect.ownKeys(value).forEach((key) => {
    // @ts-ignore -- index signature
    out[key as string] = serialize((value as any)[key], seen);
  });
  return out;
}

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

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: "deny" };
    });

    mainWindow.webContents.on("will-navigate", (event, url) => {
      if (url !== mainWindow.webContents.getURL()) {
        event.preventDefault();
        shell.openExternal(url);
      }
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
ipcMain.handle(
  "run-code",
  async (
    _event: IpcMainInvokeEvent,
    code: string
  ): Promise<RunCodeResponse> => {
    const logs: LogEntry[] = [];

    // Configuración de la sandbox
    const vm = new NodeVM({
      console: "redirect", // redirige console.* hacia los eventos
      sandbox: {}, // sin variables globales predefinidas
      timeout: 1_000, // timeout en ms
      eval: false, // deshabilita eval()
      wasm: false, // deshabilita WebAssembly
      require: {
        external: false, // no permitir require de módulos npm
        builtin: [], // ningún módulo builtin accesible
        mock: {}, // espacio para mocks si los necesitas
      },
    });

    // Captura de todos los niveles de console
    vm.on("console.log", (...args: unknown[]) =>
      logs.push({ level: "log", data: args })
    );
    vm.on("console.debug", (...args: unknown[]) =>
      logs.push({ level: "debug", data: args })
    );
    vm.on("console.info", (...args: unknown[]) =>
      logs.push({ level: "info", data: args })
    );
    vm.on("console.warn", (...args: unknown[]) =>
      logs.push({ level: "warn", data: args })
    );
    vm.on("console.error", (...args: unknown[]) =>
      logs.push({ level: "error", data: args })
    );

    try {
      // Envolvemos el código del usuario en un IIFE async
      const wrapper = `
        (async () => {
          try {
            const res = await (async () => { ${code} })();
            return { result: res, error: null };
          } catch(e) {
            return { result: null, error: e };
          }
        })()
      `;

      const runResult = (await vm.run(wrapper, "user-code.js")) as RunResult;

      return {
        logs: logs.map((entry) => ({
          level: entry.level,
          data: entry.data.map((arg) => serialize(arg)),
        })),
        result: runResult.error ? null : serialize(runResult.result),
        error: runResult.error
          ? (serialize(runResult.error) as RunCodeResponse["error"])
          : null,
      };
    } catch (err) {
      return {
        logs: [],
        result: null,
        error: {
          __type: "Error",
          name: err instanceof Error ? err.name : "UnknownError",
          message: String(err),
          stack: err instanceof Error ? err.stack : undefined,
        },
      };
    }
  }
);

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
    "https://api.shakarzr.com/api/licenses/activate",
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
