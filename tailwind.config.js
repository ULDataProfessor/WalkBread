/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './js/**/*.{js,ts}'],
  theme: {
    extend: {
      colors: {
        'bread-white': '#F8F6F0',
        'bread-brown': '#D4C4A8',
        'bread-green': '#8B9A7A',
        'bread-dark': '#3C2E26',
        'bread-gold': '#E6B800',
      },
    },
  },
  plugins: [],
};
