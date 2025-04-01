/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'lily-green': '#FF66BB', // Updated to pink
        'lily-blue': '#9966FF', // Updated to purple
        'pond-dark': '#884488', // Updated to a deeper purple
        'pond-light': '#FFF0F9', // Updated to light pink
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'marquee': 'marquee 10s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}