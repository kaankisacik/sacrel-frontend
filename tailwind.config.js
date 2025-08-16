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
        // SACREL Brand Colors
        sacrel: {
          primary: '#1a1a1a',      // Deep charcoal black
          secondary: '#f8f6f0',    // Warm off-white
          accent: '#c9a876',       // Luxury gold
          neutral: '#8b8680',      // Sophisticated gray
          light: '#fefcf8',        // Pure white with warmth
          dark: '#0f0f0f',         // Pure black,
          brown: '#3f2115',
          clay: '#8c5643',
          sand: '#d9bba0',
          sage: '#627b5d',
          white: '#f2f2f0',
        },
        // Legacy support
        beige: '#f8f6f0',
      },
      fontFamily: {
        'primary': ['Montserrat', 'sans-serif'],
        'secondary': ['Playfair Display', 'serif'],
        'accent': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'sacrel-display': ['4rem', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        'sacrel-heading-xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'sacrel-heading-lg': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'sacrel-heading-md': ['1.875rem', { lineHeight: '1.2' }],
        'sacrel-heading-sm': ['1.5rem', { lineHeight: '1.3' }],
        'sacrel-body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'sacrel-body': ['1rem', { lineHeight: '1.6' }],
        'sacrel-body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'sacrel-caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(2rem)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}