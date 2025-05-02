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
import { useTheme } from "./hooks/useTheme";
import { useTabs } from "./hooks/useTabs";

export const App = () => {
  const { autoRun, showActivityBar } = useSettings();
  const { updateAvailable, triggerUpdate, progress } = useUpdateNotification();
  const { current } = useTheme();
  const { activeTab, updateActiveTab, createTabFromImport } = useTabs();

  const [showSettings, setShowSettings] = useState(false);

  const runCode = async (inputCode: string) => {
    const trimmed = inputCode.trim();
    if (
      !trimmed ||
      trimmed
        .split("\n")
        .every((line) => line.trim().startsWith("//") || line.trim() === "")
    ) {
      updateActiveTab({ output: "", hasRun: false });
      return;
    }

    try {
      const response = await window.api.runCode(inputCode);

      // fallback si sigue viniendo un string
      if (typeof response === "string") {
        updateActiveTab({ output: response, hasRun: true });
        return;
      }

      const { logs, result, error } = response;

      updateActiveTab({
        output: { logs, result, error },
        hasRun: true,
      });
    } catch (err) {
      updateActiveTab({
        output: { logs: [], result: null, error: String(err) },
        hasRun: true,
      });
    }
  };

  const clearOutput = () => {
    updateActiveTab({ output: "", hasRun: false });
  };

  // Atajos de teclado
  useKeyboardShortcuts({
    onRun: () => runCode(activeTab.code),
    onStop: clearOutput,
  });

  // Auto-run
  useEffect(() => {
    if (!autoRun) return;

    const trimmed = activeTab.code.trim();
    if (
      !trimmed ||
      trimmed
        .split("\n")
        .every((line) => line.trim().startsWith("//") || line.trim() === "")
    )
      return;

    const timeout = setTimeout(() => runCode(activeTab.code), 500);
    return () => clearTimeout(timeout);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab.code, activeTab.id, autoRun]);

  useEffect(() => {
    const handleImport = (e: Event) => {
      const { code, name } = (e as CustomEvent<{ code: string; name: string }>)
        .detail;
      createTabFromImport({ code, name });
    };

    window.addEventListener("imported-code", handleImport);
    return () => window.removeEventListener("imported-code", handleImport);
  }, [createTabFromImport]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current.name}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="h-screen flex font-mono relative"
        style={{
          backgroundColor: current.ui.background,
          color: current.ui.text,
        }}
      >
        {showActivityBar && (
          <Sidebar
            onRun={() => runCode(activeTab.code)}
            onStop={clearOutput}
            onToggleSettings={() => setShowSettings(true)}
          />
        )}

        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <EditorPanel
              code={activeTab.code}
              setCode={(code) => updateActiveTab({ code })}
            />
            <OutputPanel output={activeTab.output} hasRun={activeTab.hasRun} />
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

              {progress > 0 && progress < 100 ? (
                <div className="flex flex-col gap-2">
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="bg-runjsAccent h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "easeOut", duration: 0.2 }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 text-right">
                    Descargando... {Math.round(progress)}%
                  </div>
                </div>
              ) : (
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
      </motion.div>
    </AnimatePresence>
  );
};
