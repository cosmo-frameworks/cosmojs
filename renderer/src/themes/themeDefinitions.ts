export type ThemeMode = "light" | "dark" | "auto";

export interface UITheme {
  name: string;
  label: string;
  editorTheme: string;
  ui: {
    background: string;
    panel: string;
    text: string;
    accent: string;
  };
  pro?: boolean;
}

export const themes: UITheme[] = [
  {
    name: "cosmo-dark",
    label: "Cosmo Dark",
    editorTheme: "cosmo-dark",
    ui: {
      background: "#1e1e2e",
      panel: "#212121",
      text: "#f5f5f5",
      accent: "#1abc9c",
    },
  },
  {
    name: "cosmo-light",
    label: "Cosmo Light",
    editorTheme: "cosmo-light",
    ui: {
      background: "#ffffff",
      panel: "#f0f0f0",
      text: "#1e1e1e",
      accent: "#007acc",
    },
  },
  {
    name: "duotone-dark",
    label: "Duotone Dark",
    editorTheme: "duotone-dark",
    ui: {
      background: "#1f1d2e",
      panel: "#2c2938",
      text: "#c3ccdc",
      accent: "#ffcc66",
    },
  },
  {
    name: "dracula",
    label: "Dracula",
    editorTheme: "dracula",
    ui: {
      background: "#282a36",
      panel: "#44475a",
      text: "#f8f8f2",
      accent: "#bd93f9",
    },
  },
  {
    name: "one-dark",
    label: "One Dark",
    editorTheme: "one-dark",
    ui: {
      background: "#282c34",
      panel: "#3a3f4b",
      text: "#abb2bf",
      accent: "#61afef",
    },
  },
  {
    name: "synthwave84",
    label: "Synthwave '84",
    editorTheme: "synthwave84",
    ui: {
      background: "#2b213a",
      panel: "#3c2a4d",
      text: "#f92aad",
      accent: "#e2b714",
    },
    pro: true,
  },
];
