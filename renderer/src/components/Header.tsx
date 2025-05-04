import { FileText, Plus, X } from "lucide-react";

import { useTheme } from "../hooks/useTheme";
import { useTabs } from "../hooks/useTabs";
import { useLicense } from "../hooks/useLicense";
import { useSettings } from "../hooks/useSettings";

export const Header = () => {
  const { current } = useTheme();
  const { info } = useLicense();
  const { tabs, activeId, setActiveId, closeTab, addTab } = useTabs();
  const { handleToggleLicenseModal } = useSettings();

  const handleAddTab = () => {
    if (info.plan === "free" && tabs.length === 3) {
      handleToggleLicenseModal();
    } else {
      addTab();
    }
  };

  return (
    <div
      className="flex justify-between items-center px-2 h-10 border-b"
      style={
        {
          WebkitAppRegion: "drag",
          backgroundColor: current.ui.panel,
          color: current.ui.text,
        } as React.CSSProperties
      }
    >
      {/* Tabs */}
      <div
        className="flex items-center gap-1"
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      >
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveId(tab.id)}
            className={`flex w-[100px] items-center justify-between gap-2 px-3 py-2 text-sm rounded cursor-pointer
              ${
                tab.id === activeId
                  ? "bg-black/20 text-white"
                  : "text-gray-400 hover:text-white"
              }
            `}
          >
            <FileText size={14} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="hover:text-red-400 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <button
          onClick={handleAddTab}
          className="ml-2 p-1 rounded hover:text-white text-gray-400 cursor-pointer"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Botones de ventana */}
      <div style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
        <div className="flex gap-2">
          <button
            onClick={() => window.api.windowControls.minimize()}
            className="w-3 h-3 bg-yellow-400 rounded-full hover:brightness-110 cursor-pointer"
            title="Minimizar"
          />
          <button
            onClick={() => window.api.windowControls.maximize()}
            className="w-3 h-3 bg-green-500 rounded-full hover:brightness-110 cursor-pointer"
            title="Maximizar"
          />
          <button
            onClick={() => window.api.windowControls.close()}
            className="w-3 h-3 bg-red-500 rounded-full hover:brightness-110 cursor-pointer"
            title="Cerrar"
          />
        </div>
      </div>
    </div>
  );
};
