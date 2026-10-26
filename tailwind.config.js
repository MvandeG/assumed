/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#121014',
        surface: '#1B181E',
        line: '#2A262D',
        ink: '#EDE6DD',
        muted: '#8F877F',
        accent: '#C9A26B',
      },
      fontFamily: {
        serif: ['"Fraunces Variable"', 'Georgia', 'serif'],
        sans: ['"Inter Variable"', 'system-ui', 'sans-serif'],
      },
      borderRadius: { card: '16px' },
      maxWidth: { col: '480px' },
    },
  },
  plugins: [],
};
