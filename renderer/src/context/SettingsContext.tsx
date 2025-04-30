import { createContext, useEffect, useState } from "react";

interface SettingsContextType {
  autoRun: boolean;
  setAutoRun: (v: boolean) => void;
  showLineNumbers: boolean;
  setShowLineNumbers: (v: boolean) => void;
  highlightActiveLine: boolean;
  setHighlightActiveLine: (v: boolean) => void;
  showActivityBar: boolean;
  setShowActivityBar: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [autoRun, setAutoRun] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [highlightActiveLine, setHighlightActiveLine] = useState(true);
  const [showActivityBar, setShowActivityBar] = useState(true);

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
  }, []);

  useEffect(() => {
    localStorage.setItem("settings_autorun", autoRun.toString());
    localStorage.setItem("settings_line_numbers", showLineNumbers.toString());
    localStorage.setItem(
      "settings_highlight_line",
      highlightActiveLine.toString()
    );
    localStorage.setItem("settings_show_sidebar", showActivityBar.toString());
    document.body.classList.remove("theme-dark", "theme-light");
  }, [autoRun, showLineNumbers, highlightActiveLine, showActivityBar]);

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
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsProvider };
export default SettingsContext;
