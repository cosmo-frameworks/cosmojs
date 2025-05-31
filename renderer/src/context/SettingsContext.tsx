import { createContext, FC, useEffect, useState } from "react";

interface SettingsContextType {
  autoRun: boolean;
  setAutoRun: (v: boolean) => void;
  showLineNumbers: boolean;
  setShowLineNumbers: (v: boolean) => void;
  highlightActiveLine: boolean;
  setHighlightActiveLine: (v: boolean) => void;
  showActivityBar: boolean;
  setShowActivityBar: (v: boolean) => void;
  showLicenseModal: boolean;
  fontSize: number;
  setFontSize: (v: number) => void;
  setShowLicenseModal: (v: boolean) => void;
  autocomplete: boolean;
  setAutocomplete: (v: boolean) => void;
  handleToggleLicenseModal: () => void;
}

interface SettingsProviderPropsI {
  children: React.ReactNode;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

const SettingsProvider: FC<SettingsProviderPropsI> = ({ children }) => {
  const [autoRun, setAutoRun] = useState<boolean>(true);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
  const [highlightActiveLine, setHighlightActiveLine] = useState<boolean>(true);
  const [showActivityBar, setShowActivityBar] = useState<boolean>(true);
  const [showLicenseModal, setShowLicenseModal] = useState<boolean>(false);
  const [autocomplete, setAutocomplete] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(14);

  const load = <T,>(key: string, fallback: T, parser: (v: string) => T): T => {
    const val = localStorage.getItem(key);
    return val !== null ? parser(val) : fallback;
  };

  useEffect(() => {
    setAutoRun(load("settings_autorun", true, (v) => v === "true"));
    setShowLineNumbers(
      load("settings_line_numbers", true, (v) => v === "true")
    );
    setHighlightActiveLine(
      load("settings_highlight_line", true, (v) => v === "true")
    );
    setShowActivityBar(
      load("settings_show_sidebar", true, (v) => v === "true")
    );
    setFontSize(load("settings_font_size", 14, (v) => parseInt(v, 10)));
    setAutocomplete(load("settings_autocomplete", true, (v) => v === "true"));
  }, []);

  useEffect(() => {
    localStorage.setItem("settings_autorun", autoRun.toString());
    localStorage.setItem("settings_line_numbers", showLineNumbers.toString());
    localStorage.setItem(
      "settings_highlight_line",
      highlightActiveLine.toString()
    );
    localStorage.setItem("settings_show_sidebar", showActivityBar.toString());
    localStorage.setItem("settings_font_size", fontSize.toString());
    localStorage.setItem("settings_autocomplete", autocomplete.toString());
    document.body.classList.remove("theme-dark", "theme-light");
  }, [
    autoRun,
    showLineNumbers,
    highlightActiveLine,
    showActivityBar,
    fontSize,
    autocomplete,
  ]);

  const handleToggleLicenseModal = () => setShowLicenseModal(!showLicenseModal);

  return (
    <SettingsContext.Provider
      value={{
        autoRun,
        setAutoRun,
        showLineNumbers,
        setShowLineNumbers,
        highlightActiveLine,
        setHighlightActiveLine,
        showActivityBar,
        setShowActivityBar,
        showLicenseModal,
        setShowLicenseModal,
        fontSize,
        setFontSize,
        autocomplete,
        setAutocomplete,
        handleToggleLicenseModal,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsProvider };
export default SettingsContext;
