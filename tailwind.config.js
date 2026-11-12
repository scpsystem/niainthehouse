/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        game: ['"Baloo 2"', 'Nunito', '"Trebuchet MS"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#2b2350',
        grape: { DEFAULT: '#6d3fc0', dark: '#4f2a96', soft: '#efe6ff' },
        mint: { DEFAULT: '#17754a', soft: '#dff6e9' },
        sun: { DEFAULT: '#ffd54a', dark: '#8a5a00' },
        cream: '#fff8ec',
      },
    },
  },
  plugins: [],
};
