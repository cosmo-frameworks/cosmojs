import { useContext } from "react";

import LicenseContext from "../context/LicenseContext";

export const useLicense = () => {
  const context = useContext(LicenseContext);
  if (!context)
    throw new Error("useLicense must be used inside LicenseProvider");
  return context;
};
