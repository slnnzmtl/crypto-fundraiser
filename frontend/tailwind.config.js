/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#121212',
          800: '#1E1E1E',
          700: '#2D2D2D',
          600: '#3D3D3D',
          500: '#4D4D4D',
        }
      },
      keyframes: {
        lineLoading: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' }
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' }
        }
      },
      animation: {
        lineLoading: 'lineLoading 1s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-in'
      }
    },
  },
  plugins: [],
}

