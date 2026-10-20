/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#E9E4DC',
        'canvas-dark': '#161513',
        'alert-red': '#C2412D',
        card: '#F6F2EA',
        ink: '#111111',
        gold: '#EBC878',
        'gold-soft': '#F5E6BE',
        mint: '#DDEFE3',
        'pink-soft': '#EFCAC3',
        emerald: '#2E9E6B',
        'mint-toggle': '#35D084',
        coral: '#D9534F',
        muted: '#6E6A63',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
