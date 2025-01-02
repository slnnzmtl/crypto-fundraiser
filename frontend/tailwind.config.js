/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-900': '#111827',
        'dark-800': '#1F2937',
        'dark-700': '#374151',
        'dark-600': '#4B5563',
        'dark-500': '#6B7280',
        'dark-400': '#9CA3AF',
        'dark-300': '#D1D5DB',
        'dark-200': '#E5E7EB',
        'dark-100': '#F3F4F6',
        'dark-50': '#F9FAFB',
      },
    },
  },
  plugins: [],
}

