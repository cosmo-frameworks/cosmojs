import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { SettingsProvider } from "./context/SettingsContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { TabsProvider } from "./context/TabsContext.tsx";

import { App } from "./App.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SettingsProvider>
      <ThemeProvider>
        <TabsProvider>
          <App />
        </TabsProvider>
      </ThemeProvider>
    </SettingsProvider>
  </StrictMode>
);
