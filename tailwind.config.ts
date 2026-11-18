import type { Config } from "tailwindcss";

// Design tokens for Coy Discover: warm cream surfaces, charcoal ink, rose accent.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FEFCF9",
          100: "#FBF7F2",
          200: "#F4EDE4",
          300: "#E9DFD2",
        },
        ink: {
          DEFAULT: "#231F20",
          soft: "#4A4443",
          muted: "#7B726E",
          faint: "#A79E99",
        },
        rose: {
          50: "#FFF1F2",
          100: "#FFE1E4",
          200: "#FFC7CE",
          300: "#FF9DA9",
          400: "#F7707F",
          500: "#E8536A",
          600: "#CF3A55",
          700: "#AB2D45",
        },
        blush: "#F9E1DC",
      },
      fontFamily: {
        display: ["Fraunces", '"Iowan Old Style"', "Georgia", "serif"],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          '"Segoe UI"',
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(35,31,32,.04), 0 8px 24px -8px rgba(35,31,32,.10)",
        lift: "0 2px 4px rgba(35,31,32,.05), 0 24px 48px -16px rgba(35,31,32,.22)",
        card: "0 30px 60px -24px rgba(35,31,32,.38)",
        glow: "0 10px 30px -8px rgba(232,83,106,.55)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
