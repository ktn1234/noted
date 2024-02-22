/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // Color palette acquired from https://colorhunt.co/palette/04364a176b8764ccc5dafffb
      colors: {
        primary: "#04364A",
        secondary: "#176B87",
        tertiary: "#64CCC5",
        quaternary: "#DAFFFB",
      },
    },
  },
  plugins: [],
};
