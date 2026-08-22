/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#090d16',
        darkCard: '#131b2e',
        darkBorder: 'rgba(255, 255, 255, 0.08)',
        brandIndigo: '#6366f1',
        brandViolet: '#8b5cf6',
      },
    },
  },
  plugins: [],
};
