import { createContext, useState, ReactNode, useCallback } from "react";
import { nanoid } from "nanoid";

export interface Tab {
  id: string;
  name?: string;
  code: string;
  output: string | { logs: any[]; result: any; error: string | null };
  hasRun: boolean;
}

interface TabsContextValue {
  tabs: Tab[];
  activeId: string;
  activeTab: Tab;
  setActiveId: (id: string) => void;
  updateTab: (id: string, changes: Partial<Tab>) => void;
  updateActiveTab: (changes: Partial<Tab>) => void;
  addTab: () => void;
  closeTab: (id: string) => void;
  createTabFromImport: (args: { name: string; code: string }) => void; // nuevo
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const TabsProvider = ({ children }: { children: ReactNode }) => {
  const createTab = (): Tab => ({
    id: nanoid(),
    code: "// Escribe tu código aquí",
    output: "",
    hasRun: false,
  });

  const createTabFromImport = ({
    name,
    code,
  }: {
    name: string;
    code: string;
  }) => {
    const newTab: Tab = {
      id: nanoid(),
      name,
      code,
      output: "",
      hasRun: false,
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveId(newTab.id);
  };

  const [tabs, setTabs] = useState<Tab[]>([createTab()]);
  const [activeId, setActiveId] = useState(tabs[0].id);

  const activeTab = tabs.find((t) => t.id === activeId)!;

  const updateTab = useCallback((id: string, changes: Partial<Tab>) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === id ? { ...tab, ...changes } : tab))
    );
  }, []);

  const updateActiveTab = useCallback(
    (changes: Partial<Tab>) => updateTab(activeId, changes),
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

    const remaining = tabs.filter((tab) => tab.id !== id);
    setTabs(remaining);

    if (id === activeId && remaining.length > 0) {
      setActiveId(remaining[remaining.length - 1].id);
    }
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
