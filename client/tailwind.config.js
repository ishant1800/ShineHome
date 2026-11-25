/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F5',
        sand: '#EFECE6',
        charcoal: '#1E1E1E',
        terracotta: '#C86D51',
        brass: '#B8860B',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        editorial: '0 14px 40px -12px rgba(30, 30, 30, 0.08)',
        card: '0 4px 24px -4px rgba(30, 30, 30, 0.06)',
      },
    },
  },
  plugins: [],
};
