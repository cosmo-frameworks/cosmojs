import { FC } from "react";

import { ObjectInspector } from "./ObjectInspector";

import { useSettings } from "../hooks/useSettings";
import { useTheme } from "../hooks/useTheme";

interface OutputPanelPropsI {
  output: string | { logs: any[]; result: any; error: string | null };
  hasRun: boolean;
}

export const OutputPanel: FC<OutputPanelPropsI> = ({ output, hasRun }) => {
  const { showLineNumbers } = useSettings();
  const { current } = useTheme();

  const renderLineNumbers = (text: string) => {
    return text
      .split("\n")
      .map((line, index) => `${(index + 1).toString().padStart(3)} | ${line}`)
      .join("\n");
  };

  return (
    <div
      className={`w-1/2 p-4 overflow-auto text-sm font-mono whitespace-pre-wrap`}
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
          {/* Mostrar logs */}
          {output.logs.length > 0 &&
            output.logs.map((log, i) => (
              <div key={i} className="mb-2">
                <ObjectInspector data={log} />
              </div>
            ))}

          {/* Mostrar error */}
          {output.error && (
            <div className="text-red-400 mt-4">Error: {output.error}</div>
          )}

          {/* Mostrar resultado (solo si es válido) */}
          {output.result !== undefined && output.result !== null && (
            <div className="mt-4 flex gap-2 items-start">
              <span className="">{"=>"}</span>
              <ObjectInspector data={output.result} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
