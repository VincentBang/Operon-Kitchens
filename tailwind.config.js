/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        operon: {
          ink: '#17211d',
          muted: '#63706a',
          line: '#d9dfda',
          paper: '#fbfaf6',
          surface: '#ffffff',
          green: '#1f6f5b',
          deep: '#124235',
          brass: '#c79645',
          soft: '#eef3ee',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        operon: '0 24px 70px rgba(23, 33, 29, 0.08)',
      },
      borderRadius: {
        operon: '8px',
      },
    },
  },
  plugins: [],
};
