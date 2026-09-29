/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#EE1D23',
          pink: '#F67280',
          coral: '#F07178',
          beige: '#F5EFE6',
          beigeLight: '#FAF7F2',
          dark: '#1C1C1E',
          card: '#F8F9FA'
        }
      },
      fontFamily: {
        sans: ['Kantumruy Pro', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
