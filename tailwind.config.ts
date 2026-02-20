import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8F0",
        coral: "#FF6B6B",
        teal: "#4ECDC4",
        golden: "#FFE66D",
        slate: "#2C3E50",
        "slate-light": "#7F8C8D",
      },
      fontFamily: {
        display: ["Baloo\\ 2", "cursive"],
        body: ["Nunito", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
