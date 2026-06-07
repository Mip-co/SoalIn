/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5B6EF5',
        secondary: '#8FA8FF',
        accent: '#F5A3B7',
        background: '#F5F7FB',
        surface: '#FFFFFF',
        'text-primary': '#2B2D42',
        'text-secondary': '#6B7280',
        border: '#E5E7EB',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
}
