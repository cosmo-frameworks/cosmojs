import { FC, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Settings, X } from "lucide-react";
import clsx from "clsx";

import { useSettings } from "../hooks/useSettings";
import { useTheme } from "../hooks/useTheme";
import { useLicense } from "../hooks/useLicense";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

import { themes } from "../themes/themeDefinitions";
import { capitalizeFirstLetter } from "../utils/basics";

interface SettingsModalPropsI {
  visible: boolean;
  onClose: () => void;
}

export const SettingsModal: FC<SettingsModalPropsI> = ({
  visible,
  onClose,
}) => {
  const innerRef = useRef<HTMLDivElement>(null!);
  useOnClickOutside(innerRef, () => onClose());

  const {
    autoRun,
    setAutoRun,
    showLineNumbers,
    setShowLineNumbers,
    highlightActiveLine,
    setHighlightActiveLine,
    showActivityBar,
    setShowActivityBar,
    fontSize,
    setFontSize,
    autocomplete,
    setAutocomplete,
    handleToggleLicenseModal,
  } = useSettings();
  const { info } = useLicense();
  const { current, setTheme } = useTheme();

  const [tab, setTab] = useState<"apariencia" | "general">("apariencia");

  const tabs = [
    { key: "general", label: "General", icon: <Settings size={16} /> },
    { key: "apariencia", label: "Apariencia", icon: <Palette size={16} /> },
  ];

  const handleSelectTheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const selectedTheme = themes.find((t) => t.name === selectedName);
    if (!selectedTheme) return;

    if (selectedTheme.pro && info.plan === "free") {
      handleToggleLicenseModal();
      return;
    }

    setTheme(selectedName);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={innerRef}
            className={clsx(
              "rounded-lg shadow-xl w-[700px] max-w-full p-6",
              "flex"
            )}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: current.ui.panel,
              color: current.ui.text,
            }}
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
                      "flex items-center gap-2 px-3 py-2 rounded text-sm font-medium cursor-pointer",
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
              {tab === "apariencia" && (
                <div>
                  <div className="font-bold mb-2">
                    {capitalizeFirstLetter(tab)}
                  </div>
                  <hr className="mb-5" />

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Tema
                      </label>
                      <select
                        value={current.name}
                        onChange={handleSelectTheme}
                        className="w-[240px] border px-2 py-1 rounded focus:outline-none"
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

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Tamaño de fuente
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={24}
                        value={fontSize}
                        onChange={(e) =>
                          setFontSize(parseInt(e.target.value, 10))
                        }
                        style={{
                          backgroundColor: current.ui.panel,
                          color: current.ui.text,
                        }}
                        className="w-[240px] border px-2 py-1 rounded focus:outline-none"
                      />
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
                        onChange={(e) =>
                          setHighlightActiveLine(e.target.checked)
                        }
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
                </div>
              )}

              {tab === "general" && (
                <div>
                  <div className="font-bold mb-2">
                    {capitalizeFirstLetter(tab)}
                  </div>
                  <hr className="mb-5" />

                  <div className="space-y-5">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={autoRun}
                        onChange={(e) => setAutoRun(e.target.checked)}
                      />
                      <label>Código de ejecución automátio en el cambio</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        id="autocomplete"
                        type="checkbox"
                        checked={autocomplete}
                        onChange={(e) => setAutocomplete(e.target.checked)}
                      />
                      <label htmlFor="autocomplete">Autocompletado</label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
