export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        padel: {
          primary: "#00c853",
          secondary: "#00a843",
          dark: "#0a0a14",
          accent: "#ffd700",
        },
        background: "#f5f7fa",
      },
      fontFamily: {
        sans: ["system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
