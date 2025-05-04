import { createContext, useState, useEffect, FC } from "react";

interface Info {
  plan: "free" | "pro";
}

interface LicenseContextI {
  info: Info;
  activate: (k: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

interface LicenseProviderPropsI {
  children: React.ReactNode;
}

const LicenseContext = createContext<LicenseContextI | undefined>(undefined);

const LicenseProvider: FC<LicenseProviderPropsI> = ({ children }) => {
  const [info, setInfo] = useState<Info>({ plan: "free" });

  useEffect(() => {
    window.api
      .getStoredLicense()
      .then((lic) => lic && setInfo({ plan: "pro" }));
  }, []);

  const activate = async (k: string) => {
    const lic = await window.api.activateLicense(k);
    if (lic) {
      setInfo({ plan: "pro" });
      return true;
    }
    return false;
  };

  const logout = async () => {
    await window.api.removeLicense();
    setInfo({ plan: "free" });
  };

  return (
    <LicenseContext.Provider value={{ info, activate, logout }}>
      {children}
    </LicenseContext.Provider>
  );
};

export { LicenseProvider };
export default LicenseContext;
