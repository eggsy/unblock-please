module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: ["src/popup/**/*.vue", "src/popup/**/*.js", "src/popup/**/*.ts"],
  },
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Segoe UI", "sans-serif"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
