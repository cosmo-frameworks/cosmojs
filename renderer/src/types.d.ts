// renderer/src/types.d.ts
export {};

declare global {
  interface Window {
    api: {
      runCode: (code: string) => Promise<string>;
      send: (channel: string, data?: any) => void;
      on: (channel: string, callback: (...args: any[]) => void) => void;
      off: (channel: string, callback: (...args: any[]) => void) => void;
      windowControls: {
        minimize: () => void;
        maximize: () => void;
        close: () => void;
      };
    };
  }
}
