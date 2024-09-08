/** @type {import('tailwindcss').Config} */

import colors from "tailwindcss/colors";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      inter: ["Inter", "system-ui"],
    },
    colors: {
      ...colors,
      primary: "#20D45C",
      "mid-gray": "#888888",
    },
    extend: {},
  },
  plugins: [],
};
