import { Play, StopCircle, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { FC } from "react";

import { useTheme } from "../hooks/useTheme";

interface SidebarPropsI {
  onRun: () => void;
  onStop: () => void;
  onToggleSettings: () => void;
}

export const Sidebar: FC<SidebarPropsI> = ({
  onRun,
  onStop,
  onToggleSettings,
}) => {
  const { current } = useTheme();

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
          title="Ejecutar (Ctrl+Enter)"
          className="w-8 h-8 flex items-center justify-center rounded cursor-pointer"
        >
          <Play size={20} />
        </button>
        <button
          onClick={onStop}
          title="Parar (Ctrl+Backspace)"
          className="w-8 h-8 flex items-center justify-center rounded cursor-pointer"
        >
          <StopCircle size={20} />
        </button>
      </div>
      <div>
        <button
          onClick={onToggleSettings}
          title="Configuración"
          className="w-8 h-8 flex items-center justify-center rounded cursor-pointer"
        >
          <Settings size={20} />
        </button>
      </div>
    </motion.div>
  );
};
