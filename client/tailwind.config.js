module.exports = {
  purge: {
    enabled: false,
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  },
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateRows: {
        // Simple 8 row grid
        8: "repeat(8, minmax(0, 1fr))",

        // Complex site-specific row configuration
        layout: "200px minmax(900px, 1fr) 100px",
      },
      fontFamily: {
        custom: "'Poppins', sans-serif",
      },
      skew: {
        "-15": "-15deg",
      },
      animation: {
        "float-up": "float-up 25s infinite",
      },
      keyframes: {
        "float-up": {
          "100%": {
            bottom: "110%",
            transform: "rotateZ(180deg)",
          },
        },
      },
    },
  },
  variants: {
    extend: {
      borderColor: ["active"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
