var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './js/main.js',
  output: { path: '../assets/js/', filename: 'app.js' },
  externals: {},
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
};
