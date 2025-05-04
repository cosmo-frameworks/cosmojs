import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { SettingsProvider } from "./context/SettingsContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { TabsProvider } from "./context/TabsContext.tsx";
import { LicenseProvider } from "./context/LicenseContext.tsx";

import { App } from "./App.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SettingsProvider>
      <ThemeProvider>
        <LicenseProvider>
          <TabsProvider>
            <App />
          </TabsProvider>
        </LicenseProvider>
      </ThemeProvider>
    </SettingsProvider>
  </StrictMode>
);
