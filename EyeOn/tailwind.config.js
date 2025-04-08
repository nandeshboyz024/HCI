/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets:[require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        primary:'#6CAFE9',
        secondary:'#8F73E2'
      }
    },
  },
  plugins: [],
}

