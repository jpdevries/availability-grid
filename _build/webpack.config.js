var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    'availability-grid':['./js/availability-grid.js']
  },
  output: {
    path: '../assets/js/',
    filename: '[name].js',
    libraryTarget: 'umd'
  },
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
