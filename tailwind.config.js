/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#84141b",   // deep red
        secondary: "#f6ebda", // light beige
      },
    },
  },
  plugins: [],
};