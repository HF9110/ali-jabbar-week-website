/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // إضافة أنميشن الوميض للمراكز الأولى
      keyframes: {
        glow: {
          "0%, 100%": {
            boxShadow:
              "0 0 10px #fde047, 0 0 20px #fde047, 0 0 30px #007bff, 0 0 40px #007bff",
            borderColor: "#fde047",
          },
          "50%": {
            boxShadow:
              "0 0 20px #fde047, 0 0 30px #007bff, 0 0 40px #007bff, 0 0 50px #007bff",
            borderColor: "#facc15",
          },
        },
      },
      animation: {
        glow: "glow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
