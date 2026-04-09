/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        "grain-light":
          "radial-gradient(circle at 15% 15%, rgba(255,255,255,.12), transparent 40%), radial-gradient(circle at 85% 5%, rgba(255,255,255,.08), transparent 35%)",
      },
    },
  },
  plugins: [],
};
