/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Popphins: ["Poppins", "sans-serif"],
        Josefin: ["Josefin Slab", "sans-serif"],
      },
    },
  },
  plugins: [],
};
