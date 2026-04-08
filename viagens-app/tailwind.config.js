/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        display: ['var(--font-syne)', 'sans-serif'],
      },
      colors: {
        navy: {
          900: '#0f1e3c',
          800: '#1a2f54',
          700: '#1e3a6e',
          600: '#234080',
        },
        slate: {
          50: '#f8fafc',
        }
      }
    },
  },
  plugins: [],
};
