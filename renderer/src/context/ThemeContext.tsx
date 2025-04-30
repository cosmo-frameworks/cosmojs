import { createContext, useEffect, useState } from "react";
import { UITheme, themes } from "../themes/themeDefinitions";

interface ThemeContextProps {
  current: UITheme;
  setTheme: (name: string) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = useState<string>("auto");

  const isSystemDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const activeTheme =
    themeName === "auto"
      ? isSystemDark
        ? "duotone-dark"
        : "light-theme-name"
      : themeName;

  const current = themes.find((t) => t.name === activeTheme) || themes[0];

  useEffect(() => {
    const saved = localStorage.getItem("theme_name");
    if (saved) setThemeName(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme_name", themeName);
    document.body.style.backgroundColor = current.ui.background;
    document.body.style.color = current.ui.text;
  }, [themeName, current]);

  return (
    <ThemeContext.Provider value={{ current, setTheme: setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeProvider };
export default ThemeContext;
