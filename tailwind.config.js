/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // ← optional but recommended for your dark mode app
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-text': 'pulse 4s ease-in-out infinite',
        'orbit-1': 'orbit1 6s linear infinite',
        'orbit-2': 'orbit2 8s linear infinite reverse',
      },
      keyframes: {
        orbit1: {
          '0%': { transform: 'rotate(0deg) translateX(40px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(40px) rotate(-360deg)' },
        },
        orbit2: {
          '0%': { transform: 'rotate(0deg) translateX(32px) rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg) translateX(32px) rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}