/* eslint-disable @typescript-eslint/no-explicit-any */
export type LogLevel = "log" | "debug" | "info" | "warn" | "error";

export interface LogEntry {
  level: LogLevel;
  data: unknown[];
}

export interface SerializedError {
  __type: "Error";
  name: string;
  message: string;
  stack?: string;
}

export interface RunCodeResponse {
  logs: LogEntry[];
  result: unknown;
  error: SerializedError | null;
}

declare global {
  interface Window {
    api: {
      runCode: (code: string) => Promise<RunCodeResponse>;
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

export {};
