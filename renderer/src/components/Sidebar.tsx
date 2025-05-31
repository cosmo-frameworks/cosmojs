import { FC } from "react";
import {
  Play,
  StopCircle,
  Settings,
  FolderOpen,
  Save,
  Crown,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

import { useTheme } from "../hooks/useTheme";
import { useTabs } from "../hooks/useTabs";
import { useSettings } from "../hooks/useSettings";
import { useLicense } from "../hooks/useLicense";

interface SidebarPropsI {
  onRun: () => void;
  onStop: () => void;
  onToggleSettings: () => void;
  onOpenPremium: () => void;
}

export const Sidebar: FC<SidebarPropsI> = ({
  onRun,
  onStop,
  onToggleSettings,
  onOpenPremium,
}) => {
  const { current } = useTheme();
  const { activeTab } = useTabs();
  const { info } = useLicense();
  const { handleToggleLicenseModal } = useSettings();

  const exportFile = () => {
    if (info.plan === "free") {
      handleToggleLicenseModal();
    } else {
      window.api.exportFile(activeTab.code);
    }
  };

  const importFile = async () => {
    if (info.plan === "free") {
      handleToggleLicenseModal();
    } else {
      const content = await window.api.importFile();
      if (content) {
        window.dispatchEvent(
          new CustomEvent("imported-code", {
            detail: {
              code: content.code,
              name: content.name || "importado",
            },
          })
        );
      }
    }
  };

  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -80, opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ backgroundColor: current.ui.panel, color: current.ui.text }}
      className="w-14 flex flex-col justify-between py-4 items-center border-r border-gray-700"
    >
      <div className="flex flex-col gap-4">
        <button
          onClick={onRun}
          title="Ejecutar"
          className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-white/10"
        >
          <Play size={20} />
        </button>

        <button
          onClick={onStop}
          title="Detener"
          className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-white/10"
        >
          <StopCircle size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={onOpenPremium}
          title="Funciones Premium"
          className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-white/10"
        >
          <Star size={20} />
        </button>

        {info.plan === "free" && (
          <button
            onClick={handleToggleLicenseModal}
            title="Activar licencia"
            className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-white/10"
          >
            <Crown size={20} />
          </button>
        )}

        <button
          onClick={exportFile}
          title="Exportar pestaña como archivo"
          className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-white/10"
        >
          <Save size={20} />
        </button>

        <button
          onClick={importFile}
          title="Importar archivo .js"
          className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-white/10"
        >
          <FolderOpen size={20} />
        </button>

        <button
          onClick={onToggleSettings}
          title="Configuración"
          className="w-8 h-8 flex items-center justify-center rounded cursor-pointer hover:bg-white/10"
        >
          <Settings size={20} />
        </button>
      </div>
    </motion.div>
  );
};
