/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "dark",
      "valentine",
      "synthwave",
      "coffee",
      "sunset",
      "pastel",
      "cupcake",
      "halloween",
    ],
  },
};
