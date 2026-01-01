/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
   extend: {
  colors: {
    bg: "rgb(var(--bg) / <alpha-value>)",
    text: "rgb(var(--text) / <alpha-value>)",
    primary: "rgb(var(--primary) / <alpha-value>)",
    "primary-contrast": "rgb(var(--primary-contrast) / <alpha-value>)",
  },
},

  },
  plugins: [],
};
