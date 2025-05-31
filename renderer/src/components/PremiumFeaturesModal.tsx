// renderer/src/components/PremiumFeaturesModal.tsx
import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import clsx from "clsx";

import { useTheme } from "../hooks/useTheme";

interface PremiumFeaturesModalProps {
  visible: boolean;
  onClose: () => void;
}

const features = [
  "Aumento del número de pestañas.",
  "Temas premiums adicionales.",
  "Importación de archivos.",
  "Exportación de pestañas.",
];

export const PremiumFeaturesModal: FC<PremiumFeaturesModalProps> = ({
  visible,
  onClose,
}) => {
  const { current } = useTheme();

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
            className={clsx(
              "rounded-lg shadow-xl w-96 max-w-full p-6",
              "flex flex-col"
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Funciones Premium</h2>
              <button
                onClick={onClose}
                className="hover:text-red-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <ul className="flex-1 space-y-3">
              {features.map((feat) => (
                <li key={feat} className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-500" />
                  <p>{feat}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
