const resolve = path => require('path').resolve(__dirname, path);
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  // cache: {
  //   type: 'filesystem',
  //   buildDependencies: {
  //     config: [__filename]
  //   }
  // },
  entry: resolve('src/main.tsx'),
  output: {
    path: resolve('public/dist')
  },
  resolve: {
    extensions: ['.jsx', '.js', '.ts', '.tsx']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
      chunkFilename: 'chunk-[id].css',
    }),
  ],
};
