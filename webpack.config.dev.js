var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');
var webpack = require('webpack');

var config = require('./webpack.config.js');
config.devtool = 'source-map';
config.output = {
  path: path.resolve(__dirname, 'build'),
  filename: 'assets/[name].js'
};

config.plugins.push(
  new ExtractTextPlugin('assets/main.css'));

config.devServer = {
  compress: true,
  historyApiFallback: true,
  inline: false
};

module.exports = config;
