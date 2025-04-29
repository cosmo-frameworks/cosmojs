import { FC, useState } from "react";
import { Palette, Keyboard, X } from "lucide-react";
import clsx from "clsx";

import { useSettings } from "../hooks/useSettings";

interface SettingsModalPropsI {
  visible: boolean;
  onClose: () => void;
}

export const SettingsModal: FC<SettingsModalPropsI> = ({ visible, onClose }) => {
  const {
    theme,
    setTheme,
    autoRun,
    setAutoRun,
    showLineNumbers,
    setShowLineNumbers,
    highlightActiveLine,
    setHighlightActiveLine,
    showActivityBar,
    setShowActivityBar,
  } = useSettings();

  const [tab, setTab] = useState<"appearance" | "shortcuts">("appearance");

  if (!visible) return null;

  const tabs = [
    { key: "appearance", label: "Apariencia", icon: <Palette size={16} /> },
    { key: "shortcuts", label: "Atajos", icon: <Keyboard size={16} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-gray-100 text-gray-800 w-[700px] max-w-full rounded shadow-lg overflow-hidden flex">
        {/* Sidebar Tabs */}
        <div className="w-44 bg-gray-200 border-r p-2">
          <div className="flex justify-between items-center mb-3 px-1">
            <span className="text-sm font-semibold text-gray-700">Ajustes</span>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {tabs.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setTab(key as typeof tab)}
                className={clsx(
                  "flex items-center gap-2 px-3 py-2 rounded text-sm font-medium",
                  tab === key
                    ? "bg-white text-black shadow"
                    : "text-gray-600 hover:bg-white"
                )}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto text-sm">
          {tab === "appearance" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Tema</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as "light" | "dark")}
                  className="w-full bg-white border px-2 py-1 rounded"
                >
                  <option value="dark">Oscuro</option>
                  <option value="light">Claro</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoRun}
                  onChange={(e) => setAutoRun(e.target.checked)}
                />
                <label>Ejecutar automáticamente</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showLineNumbers}
                  onChange={(e) => setShowLineNumbers(e.target.checked)}
                />
                <label>Mostrar números de línea</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={highlightActiveLine}
                  onChange={(e) => setHighlightActiveLine(e.target.checked)}
                />
                <label>Resaltar línea activa</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showActivityBar}
                  onChange={(e) => setShowActivityBar(e.target.checked)}
                />
                <label>Mostrar barra de actividades</label>
              </div>
            </div>
          )}

          {tab === "shortcuts" && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700 mb-2">
                Atajos disponibles
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>
                  <b>Ctrl + Shift + R</b> — Ejecutar código
                </li>
                <li>
                  <b>Ctrl + Shift + S</b> — Detener ejecución
                </li>
                <li>
                  <b>⚙️</b> — Abrir configuración
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
