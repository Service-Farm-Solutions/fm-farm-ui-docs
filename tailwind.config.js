const {heroui} = require('@heroui/theme');
/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/progress.js"
  ],
  theme: {
    extend: {
      animation: {
        'btn': 'btn 2s linear infinite',
      },
      keyframes: {
        btn: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.98)' },
        }
      }
    }
  },
  darkMode: "class",
  plugins: [nextui(),heroui()],
}

