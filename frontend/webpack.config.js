const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Adjust the entry point as needed
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/', // This is crucial for client-side routing
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public/_redirects', to: '.' }, // Copy _redirects to the build folder
      ],
    }),
  ],
  module: {
    rules: [
      // Add your loaders here
    ],
  },
};