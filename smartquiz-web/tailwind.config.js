/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'quiz-dark': '#2c5ead',    
        'quiz-primary': '#1591dc', 
        'quiz-light': '#4bb8fa',   
        'quiz-bg': '#c4e2f5',      
      }
    },
  },
  plugins: [],
}