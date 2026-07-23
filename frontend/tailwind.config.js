/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          from: '#EAF1EF',
          to: '#F7FAF9',
        },
        sidebar: '#16241F',
        surface: '#FFFFFF',
        accent: {
          DEFAULT: '#3F9C90',
          dark: '#2C7A70',
          soft: '#D9ECE8',
        },
        ink: {
          DEFAULT: '#16241F',
          muted: '#7C8C89',
        },
        line: '#E4E9E8',
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '1.25rem',
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(22, 36, 31, 0.12)',
      },
    },
  },
  plugins: [],
};