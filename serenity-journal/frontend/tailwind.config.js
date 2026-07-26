/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#2E2A26",
        washi: "#F7F3EA",
        clay: "#D98B6B",
        matcha: "#8BA888",
        sakura: "#E8A0AC",
        lilac: "#A78BBE",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(46, 42, 38, 0.08)",
        glow: "0 0 40px rgba(255, 255, 255, 0.25)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        drawEnso: {
          from: { strokeDashoffset: 400 },
          to: { strokeDashoffset: 0 },
        },
      },
      animation: {
        drift: "drift 6s ease-in-out infinite",
        enso: "drawEnso 1.8s ease-out forwards",
      },
    },
  },
  plugins: [],
};
