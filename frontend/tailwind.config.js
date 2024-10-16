import defaultTheme from "tailwindcss/defaultTheme";
/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          50: "#faf5f2",
          100: "#f3e9e1",
          200: "#e7d2c1",
          300: "#d7b39a",
          400: "#c68f71",
          500: "#ba7555",
          600: "#ad6249",
          700: "#904e3e",
          800: "#744138",
          900: "#56322b",
          950: "#321b18",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
