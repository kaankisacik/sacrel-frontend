/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  darkMode: 'class', // Dark mode'u class ile aktif et
  theme: {
    extend: {
      backgroundImage: {
        'footer': "url('/images/footer.jpg')",
      },
      colors: {
        // SACREL Brand Colors - Light & Dark Mode Support
        sacrel: {
          // Primary colors
          primary: {
            DEFAULT: '#1a1a1a',      // Deep charcoal black
            dark: '#1a1a1a',         // Light mode primary becomes dark mode light
          },
          secondary: {
            DEFAULT: '#f8f6f0',      // Warm off-white
            dark: '#f8f6f0',         // Light mode secondary becomes dark mode dark
          },
          accent: {
            DEFAULT: '#c9a876',      // Luxury gold
            dark: '#c9a876',         // Slightly lighter gold for dark mode
          },
          neutral: {
            DEFAULT: '#8b8680',      // Sophisticated gray
            dark: '#8b8680',         // Lighter gray for dark mode
          },
          light: {
            DEFAULT: '#fefcf8',      // Pure white with warmth
            dark: '#fefcf8',         // Pure black for dark mode
          },
          dark: {
            DEFAULT: '#0f0f0f',      // Pure black
            dark: '#0f0f0f',         // Pure white for dark mode
          },
          brown: {
            DEFAULT: '#3f2115',
            dark: '#3f2115',         // Lighter brown for dark mode
          },
          clay: {
            DEFAULT: '#8c5643',
            dark: '#8c5643',         // Lighter clay for dark mode
          },
          sand: {
            DEFAULT: '#d9bba0',
            dark: '#d9bba0',         // Darker sand for dark mode
          },
          sage: {
            DEFAULT: '#627b5d',      // Muted green
            dark: '#627b5d',         // Lighter sage for dark mode
          },
          white: {
            DEFAULT: '#f2f2f0',
            dark: '#f2f2f0',         // Dark background for dark mode
          },
        },
        // Enhanced system colors for dark mode
        background: {
          DEFAULT: '#ffffff',
          dark: '#ffffff',
        },
        surface: {
          DEFAULT: '#f8f6f0',
          dark: '#f8f6f0',
        },
        text: {
          primary: {
            DEFAULT: '#1a1a1a',
            dark: '#1a1a1a',
          },
          secondary: {
            DEFAULT: '#8b8680',
            dark: '#8b8680',
          },
          muted: {
            DEFAULT: '#6b7280',
            dark: '#6b7280',
          },
        },
        border: {
          DEFAULT: '#e5e7eb',
          dark: '#e5e7eb',
        },
        // Legacy support
        beige: '#f8f6f0',
      },
      fontFamily: {
        'primary': ['Avenir Next', 'Avenir', 'sans-serif'],
        'secondary': ['Avenir Next', 'Avenir', 'serif'],
        'accent': ['Avenir Next', 'Avenir', 'sans-serif'],
      },
      fontWeight: {
        'thin': '100',
        'light': '200',
        'normal': '300',
        'medium': '400',
        'semibold': '500',
        'bold': '600',
        'extrabold': '700',
        'black': '800',
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