const path = require('path');


module.exports = {
  entry: './src/index.js', // Adjust the entry point as needed
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/', // This is crucial for client-side routing
  },

  module: {
    rules: [
      // Add your loaders here
    ],
  },
};