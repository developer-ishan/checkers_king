module.exports = {
  purge: {
    enabled: false,
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      borderColor: ["active"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
