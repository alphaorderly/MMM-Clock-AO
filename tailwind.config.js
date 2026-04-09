/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./MMM-Clock-ao.js", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Orbit",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.8)" },
          "50%": { opacity: "0.8", transform: "scale(1.2)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out",
        "weather-pulse": "pulse 1.5s ease-in-out infinite",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
