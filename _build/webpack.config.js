var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './js/availability-grid.js',
  output: { path: '../assets/js/', filename: 'avail-grid.js' },
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
