const path = require('path');

const handlers = ['get-media', 'search-media'];

module.exports = {
  entry: handlers.reduce(
    (acc, handler) => ({
      ...acc,
      [handler]: `./src/handlers/${handler}.ts`,
    }),
    {}
  ),
  mode: 'production',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs',
  },
};
