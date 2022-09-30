/** @type {import('tailwindcss').Config} */
defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    fontFamily: {
      sans: ['"Raleway"', 'sans-serif']
    },
    extend: {},
  },
  plugins: [],
}
