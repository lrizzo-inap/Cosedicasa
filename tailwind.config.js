// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'grace-period': '#fff7ed',
        'penalty': '#fee2e2'
      }
    },
  },
  plugins: [],
}