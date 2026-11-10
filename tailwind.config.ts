import type { Config } from "tailwindcss";

// As cores da marca vêm de variáveis CSS para que os temas sazonais
// possam trocá-las sem alterar o código.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)",
          dark: "rgb(var(--brand-dark) / <alpha-value>)"
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          ink: "rgb(var(--accent-ink) / <alpha-value>)"
        },
        footer: "rgb(var(--footer) / <alpha-value>)",
        ink: "#1C2541",
        cafe: {
          50: "#FBF4EA",
          100: "#F5E7D3",
          200: "#E9D2B4",
          600: "#7A3E1D",
          700: "#5E2B12",
          800: "#4A2010"
        }
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-body)", "sans-serif"],
        script: ["var(--font-script)", "cursive"]
      },
      boxShadow: {
        card: "0 2px 10px rgba(16, 24, 40, 0.08)"
      },
      maxWidth: {
        site: "1280px"
      }
    }
  },
  plugins: []
};

export default config;
