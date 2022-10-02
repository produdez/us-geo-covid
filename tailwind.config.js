/** @type {import('tailwindcss').Config} */
defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  important: true,
  mode: 'jit',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    fontFamily: {
        sans: [
          '"Inter"', 'sans-serif'
        ],
    },
    extend: {},
  },
  plugins: [
  ],
}
