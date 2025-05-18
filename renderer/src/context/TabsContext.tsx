import { createContext, useState, ReactNode, useCallback } from "react";
import { nanoid } from "nanoid";
import { RunCodeResponse } from "../types";

export interface TabI {
  id: string;
  name?: string;
  code: string;
  output: "" | RunCodeResponse;
  hasRun: boolean;
}

interface TabsContextValue {
  tabs: TabI[];
  activeId: string;
  activeTab: TabI;
  setActiveId: (id: string) => void;
  updateTab: (id: string, changes: Partial<TabI>) => void;
  updateActiveTab: (changes: Partial<TabI>) => void;
  addTab: () => void;
  closeTab: (id: string) => void;
  createTabFromImport: (args: { name: string; code: string }) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const TabsProvider = ({ children }: { children: ReactNode }) => {
  const createTab = (): TabI => ({
    id: nanoid(),
    code: "// Escribe tu código aquí",
    output: "",
    hasRun: false,
  });

  const [tabs, setTabs] = useState<TabI[]>([createTab()]);
  const [activeId, setActiveId] = useState(tabs[0].id);

  const activeTab = tabs.find((t) => t.id === activeId)!;

  const updateTab = useCallback(
    (id: string, changes: Partial<TabI>) =>
      setTabs((prev) =>
        prev.map((tab) => (tab.id === id ? { ...tab, ...changes } : tab))
      ),
    []
  );

  const updateActiveTab = useCallback(
    (changes: Partial<TabI>) => updateTab(activeId, changes),
    [activeId, updateTab]
  );

  const addTab = () => {
    const newTab = createTab();
    setTabs((prev) => [...prev, newTab]);
    setActiveId(newTab.id);
  };

  const closeTab = (id: string) => {
    if (tabs.length === 1) {
      window.api.windowControls.close();
      return;
    }
    const remaining = tabs.filter((t) => t.id !== id);
    setTabs(remaining);
    if (id === activeId) {
      setActiveId(remaining[remaining.length - 1].id);
    }
  };

  const createTabFromImport = ({
    name,
    code,
  }: {
    name: string;
    code: string;
  }) => {
    const newTab: TabI = {
      id: nanoid(),
      name,
      code,
      output: "",
      hasRun: false,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveId(newTab.id);
  };

  return (
    <TabsContext.Provider
      value={{
        tabs,
        activeId,
        activeTab,
        setActiveId,
        updateTab,
        updateActiveTab,
        addTab,
        closeTab,
        createTabFromImport,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};

export { TabsProvider };
export default TabsContext;
