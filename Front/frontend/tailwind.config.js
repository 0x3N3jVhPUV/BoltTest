/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#71717A',
            a: {
              color: '#18181B',
              '&:hover': {
                color: '#3F3F46',
              },
            },
            strong: {
              color: '#18181B',
            },
            h1: {
              color: '#18181B',
            },
            h2: {
              color: '#18181B',
            },
            h3: {
              color: '#18181B',
            },
            h4: {
              color: '#18181B',
            },
          },
        },
        invert: {
          css: {
            color: '#D4D4D8',
            a: {
              color: '#FAFAFA',
              '&:hover': {
                color: '#E4E4E7',
              },
            },
            strong: {
              color: '#FAFAFA',
            },
            h1: {
              color: '#FAFAFA',
            },
            h2: {
              color: '#FAFAFA',
            },
            h3: {
              color: '#FAFAFA',
            },
            h4: {
              color: '#FAFAFA',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}