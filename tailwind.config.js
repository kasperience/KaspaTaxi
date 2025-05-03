/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'text-[#1ABC9C]', // Teal for user/rider icons
    'text-[#16a085]', // Darker teal for dropoff
    'text-[#F1C40F]', // Yellow for driver/taxi icons
    'text-[#2ECC71]', // Green for success
    'text-[#27AE60]', // Darker green
    'text-[#F39C12]', // Darker yellow
    'bg-[#1ABC9C]',   // Background versions
    'bg-[#16a085]',
    'bg-[#F1C40F]',
    'bg-[#F39C12]',
    'bg-[#2ECC71]',
    'bg-[#27AE60]',
    'border-[#1ABC9C]', // Border versions
    'border-[#16a085]',
    'border-[#F1C40F]',
    'border-[#2ECC71]',
    'hover:bg-[#1ABC9C]', // Hover versions
    'hover:bg-[#16a085]',
    'hover:bg-[#F1C40F]',
    'hover:bg-[#F39C12]',
    'hover:bg-[#2ECC71]',
    'hover:bg-[#27AE60]',
    'hover:text-[#1ABC9C]',
    'hover:text-[#16a085]',
    'hover:text-[#F1C40F]',
    'hover:text-[#2ECC71]',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Roboto', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out forwards',
        slideIn: 'slideIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
