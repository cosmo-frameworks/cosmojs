import { useEffect, useState } from "react";

export const useUpdateNotification = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleUpdateAvailable = () => {
      setUpdateAvailable(true);
    };

    const handleDownloadProgress = (percent: number) => {
      setProgress(percent);
    };

    window.api?.on?.("update-available", handleUpdateAvailable);
    window.api?.on?.("update-download-progress", handleDownloadProgress);

    return () => {
      window.api?.off?.("update-available", handleUpdateAvailable);
      window.api?.off?.("update-download-progress", handleDownloadProgress);
    };
  }, []);

  const triggerUpdate = () => {
    window.api?.send?.("install-update");
  };

  return { updateAvailable, triggerUpdate, progress };
};
