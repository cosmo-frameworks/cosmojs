import { useEffect, useState } from "react";

export const useUpdateNotification = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onAvailable = () => setUpdateAvailable(true);
    const onProgress = (p: number) => setProgress(p);
    const onDownloaded = () => setDownloaded(true);

    window.api.on("update-available", onAvailable);
    window.api.on("update-download-progress", onProgress);
    window.api.on("update-downloaded", onDownloaded);

    return () => {
      window.api.off("update-available", onAvailable);
      window.api.off("update-download-progress", onProgress);
      window.api.off("update-downloaded", onDownloaded);
    };
  }, []);

  const triggerUpdate = () => {
    window.api.send("install-update");
  };

  return {
    updateAvailable,
    downloaded,
    progress,
    triggerUpdate,
  };
};
