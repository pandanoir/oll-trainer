module.exports = {
  purge: ['./src/**/*.tsx', './src/**/*.ts', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      maxHeight: {
        '1/2-screen': '50vh',
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ['active'],
      inset: ['active'],
      position: ['active'],
    },
  },
  plugins: [],
};
