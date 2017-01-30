var config = require('./webpack.config.js');

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');
var webpack = require('webpack');

config.output = {
  path: path.resolve(__dirname, 'build'),
  filename: 'assets/[hash].[name].js'
};

config.plugins = config.plugins.concat([
  // Pull any required CSS out into a main.css file
  new ExtractTextPlugin('assets/[hash].main.css'),

  // Optimize using Uglify
  new webpack.optimize.UglifyJsPlugin({
    compress: true
  })
]);

module.exports = config;
