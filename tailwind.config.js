/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1f8ff",
          100: "#dceeff",
          200: "#b9deff",
          300: "#83c7ff",
          400: "#46a8ff",
          500: "#1d87ff",
          600: "#0669f5",
          700: "#0553d3",
          800: "#0a47a0",
          900: "#103f7d"
        }
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(16, 63, 125, 0.25)"
      }
    },
  },
  plugins: [],
};
