var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: {
    app: './site/app.js'
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'assets/[name].js'
  },

  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css')
      }
    ]
  },

  plugins: [
    // Copy static aassets into the build directory
    new CopyWebpackPlugin([{
      from: './site/CNAME',
      to: 'CNAME',
      toType: 'file'
    },{
      from: './site/*.html',
      to: '[name].html'
    },{
      from: './site/fonts',
      to: 'assets/fonts/'
    }, {
      from: './site/templates',
      to: 'templates'
    },{
      from: './data/congress_members.json',
      to: 'data/congress_members.json'
    }]),

    // Pull any required CSS out into a main.css file
    new ExtractTextPlugin('assets/main.css'),

    // Automatically inject Angular dependencies using @ngInject
    new ngAnnotatePlugin({ add: true }),

    // Optimize using Uglify
    new webpack.optimize.UglifyJsPlugin({
      compress: true
    })
  ],

  devServer: {
    compress: true,
    historyApiFallback: true,
    inline: false
  }
};
