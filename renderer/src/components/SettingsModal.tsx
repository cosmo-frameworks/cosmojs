import { FC, useState } from "react";
import { Palette, X } from "lucide-react";
import clsx from "clsx";

import { useSettings } from "../hooks/useSettings";
import { useTheme } from "../hooks/useTheme";

import { themes } from "../themes/themeDefinitions";

interface SettingsModalPropsI {
  visible: boolean;
  onClose: () => void;
}

export const SettingsModal: FC<SettingsModalPropsI> = ({
  visible,
  onClose,
}) => {
  const {
    autoRun,
    setAutoRun,
    showLineNumbers,
    setShowLineNumbers,
    highlightActiveLine,
    setHighlightActiveLine,
    showActivityBar,
    setShowActivityBar,
  } = useSettings();
  const { current, setTheme } = useTheme();

  const [tab, setTab] = useState<"appearance">("appearance");

  if (!visible) return null;

  const tabs = [
    { key: "appearance", label: "Apariencia", icon: <Palette size={16} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div
        className="w-[700px] max-w-full rounded shadow-lg overflow-hidden flex"
        style={{ backgroundColor: current.ui.panel, color: current.ui.text }}
      >
        {/* Sidebar Tabs */}
        <div className="w-44 border-r p-2">
          <div className="flex justify-between items-center mb-3 px-1">
            <span className="text-sm font-semibold">Ajustes</span>
            <button
              onClick={onClose}
              className="hover:text-red-500 cursor-pointer"
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
                style={{
                  backgroundColor: current.ui.panel,
                  color: current.ui.text,
                }}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto text-sm ">
          {tab === "appearance" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Tema</label>
                <select
                  value={current.name}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                  style={{
                    backgroundColor: current.ui.panel,
                    color: current.ui.text,
                  }}
                >
                  {themes.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.label} {t.pro && "🔒"}
                    </option>
                  ))}
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
        </div>
      </div>
    </div>
  );
};
