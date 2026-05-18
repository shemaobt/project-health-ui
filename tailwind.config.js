/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FBF8F1',
          100: '#F5EFDF',
          150: '#EFE7D2',
          200: '#E8DCBE',
          300: '#D9C8A0',
        },
        earth: {
          300: '#A8916F',
          400: '#8E7857',
          500: '#6E5A3F',
          600: '#534127',
          700: '#3E311C',
          800: '#2C2413',
          900: '#1B160B',
        },
        clay: {
          50: '#FBEEE2',
          100: '#F3D8BF',
          200: '#E9B894',
          400: '#D08658',
          500: '#BE6A3B',
          600: '#A4542A',
          700: '#82411F',
        },
        sage: {
          50: '#EEF1E5',
          100: '#DDE3CA',
          200: '#C0CAA6',
          400: '#8B9C70',
          500: '#73855A',
          600: '#5B6B45',
          700: '#475436',
        },
      },
      fontFamily: {
        serif: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Segoe UI"',
          'system-ui',
          'sans-serif',
        ],
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Segoe UI"',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(62, 49, 28, 0.04), 0 6px 18px -8px rgba(62, 49, 28, 0.08)',
        lift: '0 2px 4px rgba(62, 49, 28, 0.05), 0 16px 36px -12px rgba(62, 49, 28, 0.14)',
        'inner-soft': 'inset 0 0 0 1px rgba(62, 49, 28, 0.07)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'mic-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.55' },
          '50%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'mic-ring': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        'dot-bounce': {
          '0%, 80%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '40%': { transform: 'translateY(-3px)', opacity: '1' },
        },
        'soft-pulse': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 480ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
        'fade-in': 'fade-in 420ms ease-out both',
        'mic-pulse': 'mic-pulse 1.6s ease-out infinite',
        'mic-ring': 'mic-ring 2.4s ease-in-out infinite',
        'dot-bounce': 'dot-bounce 1.2s ease-in-out infinite',
        'soft-pulse': 'soft-pulse 2.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
