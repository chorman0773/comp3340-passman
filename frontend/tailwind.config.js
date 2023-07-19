const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        "passman-blue": "#0085FF",
        "passman-red": "#FA5E5E",
        "passman-black": "#1E1E1E",
        "passman-white": "#F6F6F6",
        "dark-gray": "#464646",
        gray: "#7E7E7E",
        "light-gray": "#C5C5C5",
        "page-background": "#E7E7E7",
        "hover-tint": "#1E1E1E1A",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
