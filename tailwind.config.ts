import type { Config } from "tailwindcss";
import { PluginCreator } from "tailwindcss/types/config";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      gridTemplateColumns: {
        edgetip: "64px 1fr 64px",
      },
    },
  },
  plugins: [
    ((api) => {
      api.addUtilities({
        ".tooltip": {
          position: "relative",
          display: "inline-block",
          cursor: "pointer",
          "&::before": {
            content: "attr(data-tooltip)",
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            "background-color": "#333",
            color: "white",
            padding: "5px",
            "border-radius": "5px",
            "font-size": "12px",
            "white-space": "nowrap",
            opacity: "0",
            visibility: "hidden",
            transition: "opacity 0.3s",
          },
          "&:hover::before": {
            opacity: "1",
            visibility: "visible",
          },
        },
      });
    }) as PluginCreator,
  ],
};
export default config;
