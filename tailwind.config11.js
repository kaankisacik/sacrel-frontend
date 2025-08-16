/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        'sacrel': {
          'primary': '#1a1a1a',
          'secondary': '#f5f5f5',
          'accent': '#d4af37',
          'light': '#fafafa',
          'neutral': '#6b7280',
        }
      },
      fontFamily: {
        'accent': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'sacrel-heading-xl': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
        'sacrel-heading-lg': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
        'sacrel-heading-md': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'sacrel-body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'sacrel-body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
      }
    },
  },
  plugins: [],
}
