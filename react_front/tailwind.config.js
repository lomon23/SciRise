/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // --- ДОДАЄМО АНІМАЦІЮ ---
      animation: {
        blob: "blob 10s infinite", // Базова анімація "blob"
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)", // Рух вгору-вправо і збільшення
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)", // Рух вниз-вліво і зменшення
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)", // Повернення
          },
        },
      },
    },
  },
  plugins: [],
}