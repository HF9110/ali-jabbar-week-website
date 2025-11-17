/** @type {import('tailwindcss').Config} */
// (تصحيح) استخدام 'export default' لأن 'package.json' هو "type": "module"
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // (جديد) إضافة الأنميشن للوميض للمراكز الأولى
      keyframes: {
        glow: {
          '0%, 100%': { 
            boxShadow: '0 0 10px #fde047, 0 0 20px #fde047, 0 0 30px #fca120, 0 0 40px #fca120',
            borderColor: '#fde047'
          },
          '50%': { 
            boxShadow: '0 0 20px #fde047, 0 0 30px #fca120, 0 0 40px #fca120, 0 0 50px #fca120',
            borderColor: '#facc15'
           },
        }
      },
      animation: {
        glow: 'glow 2.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}