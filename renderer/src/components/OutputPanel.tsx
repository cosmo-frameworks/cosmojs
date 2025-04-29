import { FC } from "react";

import { useSettings } from "../hooks/useSettings";

interface OutputPanelPropsI {
  output: string;
  hasRun: boolean;
}

export const OutputPanel: FC<OutputPanelPropsI> = ({ output, hasRun }) => {
  const { showLineNumbers } = useSettings();

  return (
    <div
      className={`
        w-1/2 bg-[#212121] p-4 overflow-auto text-sm text-gray-200
        whitespace-pre-wrap font-mono
        ${showLineNumbers ? "pl-8 relative" : ""}
      `}
    >
      {hasRun ? (
        <pre className="leading-relaxed">
          {showLineNumbers
            ? output
                .split("\n")
                .map(
                  (line, index) =>
                    `${index + 1}`.padStart(3, " ") + " | " + line
                )
                .join("\n")
            : output}
        </pre>
      ) : (
        <span className="text-gray-500">Salida aparecerá aquí…</span>
      )}
    </div>
  );
};
