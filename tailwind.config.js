/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'text-[#1ABC9C]', // Teal for user/rider icons
    'text-[#16a085]', // Darker teal for dropoff
    'text-[#F1C40F]', // Yellow for driver/taxi icons
    'bg-[#1ABC9C]',   // Background versions
    'bg-[#16a085]',
    'bg-[#F1C40F]',
    'border-[#1ABC9C]', // Border versions
    'border-[#16a085]',
    'border-[#F1C40F]',
    'hover:bg-[#1ABC9C]', // Hover versions
    'hover:bg-[#16a085]',
    'hover:bg-[#F1C40F]',
    'hover:text-[#1ABC9C]',
    'hover:text-[#16a085]',
    'hover:text-[#F1C40F]',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Roboto', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
