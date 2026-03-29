/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        keep: {
          50: "#fffef5",
          100: "#ffff8d",
          200: "#fff475",
          300: "#ffeb3b",
          400: "#ffea00",
          500: "#ffd600",
          600: "#fbc02d",
          700: "#f9a825",
        },
      },
      boxShadow: {
        keep: "0 4px 10px rgba(0,0,0,0.15)",
        keepHover: "0 8px 20px rgba(0,0,0,0.25)",
        glow: "0 0 25px rgba(255,214,0,0.8)",
      },
      fontFamily: {
        handwritten: ['"Playwrite New Zealand Basic"', "cursive"],
      },
    },
  },
  plugins: [],
};
