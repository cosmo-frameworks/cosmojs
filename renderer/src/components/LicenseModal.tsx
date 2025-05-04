import { FC, useState } from "react";
import { X } from "lucide-react";

import { useLicense } from "../hooks/useLicense";
import { useTheme } from "../hooks/useTheme";

interface LicenseModalPropsI {
  visible: boolean;
  onClose: () => void;
}

export const LicenseModal: FC<LicenseModalPropsI> = ({ visible, onClose }) => {
  const { activate } = useLicense();
  const { current } = useTheme();

  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  if (!visible) return null;

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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        className="bg-gray-100 w-[480px] p-6 rounded relative"
        style={{ backgroundColor: current.ui.panel, color: current.ui.text }}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-red-500 cursor-pointer"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold mb-2">Activación CosmoJS</h2>
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
      </div>
    </div>
  );
};
