/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#f5fbf6',
          100: '#e8f6ea',
          200: '#cfead3',
          300: '#a8d5ad',
          400: '#7bbc7f',
          500: '#59a55e',
          600: '#3f8a45',
          700: '#2f6c35',
          800: '#26562b',
          900: '#1e4623',
        },
      },
    },
  },
  plugins: [],
}