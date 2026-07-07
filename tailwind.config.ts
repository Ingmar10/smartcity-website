import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SmartCity / QuoteSmart brand palette
        brand: {
          DEFAULT: "#6B3FD0", // primary purple
          dark: "#4A2BA0",
          light: "#9F6FE5",
        },
        ink: "#141019", // near-black headline ink
        subtle: "#605A6E", // muted body text
        canvas: "#F7F6FB", // light background
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #5B5FDD 0%, #9F3FD8 100%)",
      },
      maxWidth: {
        content: "1200px",
      },
      spacing: {
        // Apple-style generous section rhythm
        section: "120px",
        "section-lg": "160px",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.3)", opacity: "0" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
