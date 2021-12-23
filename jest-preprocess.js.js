const babelOptions = {
  presets: ['@babel/env', '@babel/preset-typescript'],
  babelConfig: true,
};

module.exports = require('babel-jest').createTransformer(babelOptions);
