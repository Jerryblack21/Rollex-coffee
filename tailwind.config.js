/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#101010',
        espresso: '#39251C',
        cream: '#F4E7C5',
        gold: { DEFAULT: '#D6B15E', light: '#F0D58F', dark: '#9C7B32' },
        counter: '#1F6F8B',
      },
      fontFamily: {
        display: ['"Playfair Display Variable"', 'Georgia', 'serif'],
        sans: ['"Inter Variable"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        drift: {
          '0%': { transform: 'translate3d(0,0,0)', opacity: '0' },
          '15%': { opacity: '1' },
          '100%': { transform: 'translate3d(var(--dx,20px),-120vh,0)', opacity: '0' },
        },
        steam: {
          '0%': { transform: 'translate3d(0,20px,0) scale(.7)', opacity: '0' },
          '30%': { opacity: '.55' },
          '100%': { transform: 'translate3d(var(--sx,12px),-90px,0) scale(1.5)', opacity: '0' },
        },
        shimmer: { '0%': { backgroundPosition: '0% 50%' }, '100%': { backgroundPosition: '200% 50%' } },
      },
      animation: {
        drift: 'drift var(--dur,14s) linear infinite',
        steam: 'steam var(--dur,5s) ease-out infinite',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
  plugins: [],
};
