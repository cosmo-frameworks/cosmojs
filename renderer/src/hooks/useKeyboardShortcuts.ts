import { useEffect } from "react";

export const useKeyboardShortcuts = ({
  onRun,
  onStop,
}: {
  onRun: () => void;
  onStop: () => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      if (ctrlOrCmd && e.shiftKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        onRun();
      }

      if (ctrlOrCmd && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onStop();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onRun, onStop]);
};
