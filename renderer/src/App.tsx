import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { EditorPanel } from "./components/EditorPanel";
import { OutputPanel } from "./components/OutputPanel";
import { SettingsModal } from "./components/SettingsModal";

import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useSettings } from "./hooks/useSettings";
import { useUpdateNotification } from "./hooks/useUpdateNotification";

export const App = () => {
  const { theme, autoRun, showActivityBar } = useSettings();
  const { updateAvailable, triggerUpdate, progress } = useUpdateNotification();

  const [code, setCode] = useState("// Escribe tu código aquí");
  const [output, setOutput] = useState("");
  const [hasRun, setHasRun] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const runCode = async (inputCode: string) => {
    const trimmedCode = inputCode.trim();
    if (
      !trimmedCode ||
      trimmedCode
        .split("\n")
        .every((line) => line.trim().startsWith("//") || line.trim() === "")
    ) {
      setOutput("");
      setHasRun(false);
      return;
    }

    try {
      const result = await window.api.runCode(inputCode);
      setOutput(result);
      setHasRun(true);
    } catch (err) {
      setOutput(String(err));
      setHasRun(true);
    }
  };

  const clearOutput = () => {
    setOutput("");
    setHasRun(false);
  };

  useKeyboardShortcuts({
    onRun: () => runCode(code),
    onStop: clearOutput,
  });

  useEffect(() => {
    if (!autoRun) return;
    const trimmed = code.trim();
    if (
      !trimmed ||
      trimmed
        .split("\n")
        .every((line) => line.trim().startsWith("//") || line.trim() === "")
    )
      return;

    const timeout = setTimeout(() => runCode(code), 500);
    return () => clearTimeout(timeout);
  }, [code, autoRun]);

  return (
    <div
      className={`h-screen flex font-mono relative ${
        theme === "light" ? "bg-white text-black" : "bg-runjsBg text-white"
      }`}
    >
      {showActivityBar && (
        <Sidebar
          onRun={() => runCode(code)}
          onStop={clearOutput}
          onToggleSettings={() => setShowSettings(true)}
        />
      )}

      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <EditorPanel code={code} setCode={setCode} />
          <OutputPanel output={output} hasRun={hasRun} />
        </div>
      </div>

      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <AnimatePresence>
        {updateAvailable && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-4 right-4 bg-runjsPanel text-white p-4 rounded shadow-lg flex flex-col gap-3 w-80"
          >
            <div className="text-base font-semibold flex items-center gap-2">
              🚀 ¡Nueva versión disponible!
            </div>

            {/* Mostrar progreso mientras descarga */}
            {progress > 0 && progress < 100 ? (
              <div className="flex flex-col gap-2">
                {/* Barra de progreso */}
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="bg-runjsAccent h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut", duration: 0.2 }}
                  />
                </div>
                {/* Texto pequeño */}
                <div className="text-xs text-gray-400 text-right">
                  Descargando... {Math.round(progress)}%
                </div>
              </div>
            ) : (
              /* Cuando termina de descargar */
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                onClick={triggerUpdate}
                className="bg-runjsAccent hover:bg-green-500 text-black px-4 py-2 rounded text-sm font-semibold"
              >
                Actualizar ahora
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
