/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#007BFF',
        'custom-green': '#28A745',
        'custom-purple': '#6f42c1',
      },
    },
  },
  plugins: [],
};
