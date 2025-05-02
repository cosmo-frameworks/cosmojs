import { FC, useState } from "react";
import ReactJson from "react-json-view";
import { useTheme } from "../hooks/useTheme";
import { jsonThemes } from "../themes/json-themes/jsonThemes";
import { ClipboardCopy } from "lucide-react";

interface ObjectInspectorPropsI {
  data: any;
}

export const ObjectInspector: FC<ObjectInspectorPropsI> = ({ data }) => {
  const { current } = useTheme();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    let textToCopy = "";

    if (
      typeof data === "string" ||
      typeof data === "number" ||
      typeof data === "boolean" ||
      data === null
    ) {
      textToCopy = String(data);
    } else if (Array.isArray(data)) {
      const isFlat = data.every(
        (item) =>
          typeof item === "string" ||
          typeof item === "number" ||
          typeof item === "boolean" ||
          item === null
      );
      textToCopy = isFlat
        ? `[${data.map((item) =>
            typeof item === "string" ? `"${item}"` : item
          )}]`
        : JSON.stringify(data, null, 2);
    } else if (typeof data === "object") {
      textToCopy = JSON.stringify(data, null, 2);
    } else {
      textToCopy = "(No se puede copiar este tipo de dato)";
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const CopyButton = () => (
    <button
      onClick={copyToClipboard}
      title={copied ? "Copiado" : "Copiar"}
      className="cursor-pointer flex items-center text-xs px-2 py-1 rounded shadow-sm transition-all "
      style={{
        backgroundColor: current.ui.panel,
        color: current.ui.text,
      }}
    >
      <ClipboardCopy size={14} className=" mr-1" />
      {copied ? "Copiado" : "Copiar"}
    </button>
  );

  const isPrimitive =
    typeof data === "string" ||
    typeof data === "number" ||
    typeof data === "boolean" ||
    data === null;

  const isArray = Array.isArray(data);
  const isFlatArray =
    isArray &&
    data.every(
      (item) =>
        typeof item === "string" ||
        typeof item === "number" ||
        typeof item === "boolean" ||
        item === null
    );
  const isComplexArray = isArray && !isFlatArray;
  const isObject = typeof data === "object" && data !== null && !isArray;

  return (
    <div className="flex items-center justify-between p-2 text-sm font-mono">
      {isPrimitive && (
        <div className="whitespace-pre-wrap break-words">
          {typeof data === "string" ? `"${data}"` : String(data)}
        </div>
      )}

      {isFlatArray && (
        <div className="whitespace-pre-wrap break-words">
          [
          {data
            .map((item) => (typeof item === "string" ? `"${item}"` : item))
            .join(", ")}
          ]
        </div>
      )}

      {(isComplexArray || isObject) && (
        <ReactJson
          src={data}
          name={false}
          collapsed={1}
          theme={jsonThemes[current.name] ?? "monokai"}
          enableClipboard={false}
          displayObjectSize={true}
          displayDataTypes={false}
          style={{
            backgroundColor: "transparent",
            fontSize: "0.875rem",
            fontFamily: "Fira Code, monospace",
          }}
        />
      )}

      <CopyButton />
    </div>
  );
};
