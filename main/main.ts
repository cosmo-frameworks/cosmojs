import { app, BrowserWindow, ipcMain } from "electron";
import { VM } from "vm2";
import { dialog } from "electron";
import { autoUpdater } from "electron-updater";
import fs from "fs";
import path from "path";

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
    backgroundColor: "#1e1e2e",
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

  //Cuando main esté listo, cerramos splash y mostramos main
  mainWindow.once("ready-to-show", () => {
    setTimeout(() => {
      if (splashWindow) {
        splashWindow.close();
      }
      mainWindow.show();
    }, 5000);
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

// Eventos de actualización automática
autoUpdater.on("update-available", () => {
  console.log("Update disponible");
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

ipcMain.handle("import-file", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [{ name: "Archivos", extensions: ["js", "json"] }],
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
    filters: [{ name: "Archivos JS", extensions: ["js", "json"] }],
  });

  if (canceled || !filePath) return;

  fs.writeFileSync(filePath, code, "utf-8");
});

// Eventos para ejecutar código seguro
ipcMain.handle("run-code", async (_event, code: string) => {
  try {
    const logs: any[] = [];

    const vm = new VM({
      timeout: 1000,
      sandbox: {
        console: {
          log: (...args: any[]) => {
            const safeArgs = args.map((arg) => {
              try {
                return JSON.parse(JSON.stringify(arg)); // convierte a objeto plano
              } catch {
                return String(arg);
              }
            });
            logs.push(...safeArgs); // guarda los logs como array de objetos
          },
        },
      },
    });

    const wrappedCode = `(function() { ${code} })()`;
    const result = vm.run(wrappedCode);

    let safeResult = undefined;

    try {
      if (result !== undefined) {
        safeResult = JSON.parse(JSON.stringify(result));
      }
    } catch {
      if (result !== undefined) {
        safeResult = String(result);
      }
    }

    return {
      logs,
      result: safeResult,
      error: null,
    };
  } catch (err) {
    return {
      logs: [],
      result: null,
      error: String(err),
    };
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

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
