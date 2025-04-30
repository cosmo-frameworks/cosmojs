import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { SettingsProvider } from "./context/SettingsContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";

import { App } from "./App.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SettingsProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </SettingsProvider>
  </StrictMode>
);
