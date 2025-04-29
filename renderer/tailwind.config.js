/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class"], // Habilita modo oscuro por clase
  theme: {
    extend: {
      colors: {
        runjsBg: "#1e1e2e",
        runjsPanel: "#252539",
        runjsAccent: "#1abc9c",
      },
      fontFamily: {
        mono: ["Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
