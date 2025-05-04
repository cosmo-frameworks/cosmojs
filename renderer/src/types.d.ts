export {};

declare global {
  interface Window {
    api: {
      runCode: (
        code: string
      ) => Promise<{ logs: any[]; result: any; error: string | null }>;
      send: (channel: string, data?: any) => void;
      on: (channel: string, callback: (...args: any[]) => void) => void;
      off: (channel: string, callback: (...args: any[]) => void) => void;
      importFile: () => Promise<{ code: string; name: string } | null>;
      exportFile: (code: string) => Promise<void>;
      activateLicense: (key: string) => Promise<any>;
      getStoredLicense: () => Promise<any>;
      removeLicense: () => Promise<any>;
      windowControls: {
        minimize: () => void;
        maximize: () => void;
        close: () => void;
      };
    };
  }
}
