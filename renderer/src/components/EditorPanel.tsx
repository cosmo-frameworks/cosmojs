import { FC } from "react";
import Editor, { OnMount } from "@monaco-editor/react";

import { useTheme } from "../hooks/useTheme";
import { useSettings } from "../hooks/useSettings";

import { monacoThemes } from "../themes";

interface EditorPanelPropsI {
  code: string;
  setCode: (value: string) => void;
}

export const EditorPanel: FC<EditorPanelPropsI> = ({ code, setCode }) => {
  const { showLineNumbers, highlightActiveLine } = useSettings();
  const { current } = useTheme();

  const handleEditorMount: OnMount = (_, monacoInstance) => {
    const theme = monacoThemes[current.name];
    if (theme) {
      monacoInstance.editor.defineTheme(current.name, theme);
      monacoInstance.editor.setTheme(current.name);
    } else {
      monacoInstance.editor.setTheme(current.editorTheme);
    }
  };

  return (
    <div className="w-1/2 border-r border-gray-700">
      <Editor
        height="100%"
        language="javascript"
        value={code}
        onChange={(value) => setCode(value || "")}
        theme={current.name}
        onMount={handleEditorMount}
        options={{
          fontSize: 14,
          fontFamily: "Fira Code, monospace",
          lineNumbers: showLineNumbers ? "on" : "off",
          renderLineHighlight: highlightActiveLine ? "line" : "none",
          minimap: { enabled: false },
          automaticLayout: true,
        }}
      />
    </div>
  );
};
