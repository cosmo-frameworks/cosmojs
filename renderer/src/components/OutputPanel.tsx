import { FC, ReactNode } from "react";

import { ObjectInspector } from "./ObjectInspector";

import { useSettings } from "../hooks/useSettings";
import { useTheme } from "../hooks/useTheme";

import { LogEntry, RunCodeResponse } from "../types";

interface OutputPanelPropsI {
  output: "" | RunCodeResponse;
  hasRun: boolean;
}

export const OutputPanel: FC<OutputPanelPropsI> = ({ output, hasRun }) => {
  const { showLineNumbers } = useSettings();
  const { current } = useTheme();

  const renderLineNumbers = (text: string) =>
    text
      .split("\n")
      .map((line, i) => `${(i + 1).toString().padStart(3)} | ${line}`)
      .join("\n");

  // Nuevo helper: formatea cada argumento de console.log
  const formatLogItem = (item: unknown): ReactNode => {
    if (
      typeof item === "string" ||
      typeof item === "number" ||
      typeof item === "boolean" ||
      item === null
    ) {
      return String(item);
    }
    if (Array.isArray(item)) {
      // formato plano para arrays
      return `[ ${item.map((v) => JSON.stringify(v)).join(", ")} ]`;
    }
    // para cualquier otro objeto complejo, usamos tu ObjectInspector
    return <ObjectInspector data={item} />;
  };

  const renderLogEntry = (entry: LogEntry, idx: number) => (
    <div key={idx} className="mb-2">
      {/* si viene un solo argumento, solo mostramos ese */}
      {entry.data.length === 1 ? (
        <pre>{formatLogItem(entry.data[0])}</pre>
      ) : (
        // si hay varios args, los separamos con espacios
        <pre>
          {entry.data.map((itm, i) => (
            <span key={i}>{formatLogItem(itm)} </span>
          ))}
        </pre>
      )}
    </div>
  );

  return (
    <div
      className="w-1/2 p-4 overflow-auto text-sm font-mono whitespace-pre-wrap"
      style={{
        backgroundColor: current.ui.panel,
        color: current.ui.text,
      }}
    >
      {!hasRun && <span>Salida aparecerá aquí…</span>}

      {hasRun && typeof output === "string" && (
        <pre>{showLineNumbers ? renderLineNumbers(output) : output}</pre>
      )}

      {hasRun && typeof output === "object" && (
        <>
          {/* Logs ya renderizados como texto/plain o inspector */}
          {output.logs.map(renderLogEntry)}

          {/* Error */}
          {output.error && (
            <div className="text-red-400 mt-4">
              Error: {output.error.name}: {output.error.message}
            </div>
          )}

          {/* Resultado */}
          {output.result !== undefined && output.result !== null && (
            <div className="mt-4 flex gap-2 items-start">
              <span>{"=>"}</span>
              <ObjectInspector data={output.result} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
