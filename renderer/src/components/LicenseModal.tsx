import { FC, useRef, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useLicense } from "../hooks/useLicense";
import { useTheme } from "../hooks/useTheme";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

interface LicenseModalPropsI {
  visible: boolean;
  onClose: () => void;
}

export const LicenseModal: FC<LicenseModalPropsI> = ({ visible, onClose }) => {
  const innerRef = useRef<HTMLDivElement>(null!);
  useOnClickOutside(innerRef, () => onClose());

  const { activate } = useLicense();
  const { current } = useTheme();

  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  const handleActivate = async () => {
    const ok = await activate(key);

    if (ok) onClose();
    else setError("Clave inválida");
  };

  const handleClose = () => {
    setError("");
    setKey("");
    onClose();
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
            className="rounded-lg shadow-xl w-[480px] max-w-full p-6"
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
              <h2 className="text-lg font-semibold">Activación CosmoJS</h2>
              <button
                onClick={handleClose}
                className="hover:text-red-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-sm mb-4">
              Introduce tu clave de licencia para desbloquear funciones premium.
            </p>

            <textarea
              value={key}
              onChange={(e) => setKey(e.target.value)}
              rows={3}
              className="w-full border rounded p-2 font-mono text-sm"
              placeholder=""
            />

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <div className="mt-4 flex items-center justify-between">
              <a
                href="https://cosmoframeworks.shakarzr.com"
                target="_blank"
                className="text-sm underline"
                style={{
                  color: current.ui.text,
                }}
              >
                Comprar licencia…
              </a>

              <button
                onClick={handleActivate}
                disabled={!key.trim()}
                className="text-white px-4 py-1 rounded cursor-pointer"
                style={{
                  backgroundColor: current.ui.panel,
                  color: current.ui.text,
                }}
              >
                Activar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
