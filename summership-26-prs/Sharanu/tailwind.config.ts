import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B1220",
        panel: "#131B2E",
        gold: "#E8B34D",
        vermilion: "#C65D3B",
        ink: "#F3EEE3",
        mutedSoft: "#B9C0D4",
        muted: "#8C96AC",
        line: "#2A3550",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
