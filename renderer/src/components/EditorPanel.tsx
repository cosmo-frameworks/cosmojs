import { FC } from "react";
import Editor from "@monaco-editor/react";

import { useSettings } from "../hooks/useSettings";

interface EditorPanelPropsI {
  code: string;
  setCode: (value: string) => void;
}

export const EditorPanel: FC<EditorPanelPropsI> = ({
  code,
  setCode,
}: {
  code: string;
  setCode: (value: string) => void;
}) => {
  const { theme, showLineNumbers, highlightActiveLine } = useSettings();

  return (
    <div className="w-1/2 border-r border-gray-700">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={code}
        onChange={(value) => setCode(value || "")}
        theme={theme === "light" ? "vs-light" : "vs-dark"}
        options={{
          fontSize: 14,
          lineNumbers: showLineNumbers ? "on" : "off",
          renderLineHighlight: highlightActiveLine ? "line" : "none",
        }}
      />
    </div>
  );
};
