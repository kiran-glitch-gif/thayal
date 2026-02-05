/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D32F2F', // Maroon Red
        accent: '#FFB300', // Gold
        success: '#4CAF50',
        light: '#F8F9FA',
        dark: '#1E1E1E',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
