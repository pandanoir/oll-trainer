module.exports = {
  purge: ['./src/**/*.tsx', './src/**/*.ts', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      maxHeight: {
        '1/2-screen': '50vh',
      },
      transitionProperty: {
        position: 'top, left, bottom, right',
      },
      transitionDuration: {
        2000: '2000ms',
      },
      zIndex: {
        '-10': '-10',
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
