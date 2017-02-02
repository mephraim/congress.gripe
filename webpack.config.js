var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    app: './site/app.js'
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
    },{
      from: './data/congressional_districts_by_zipcode.json',
      to: 'data/congressional_districts_by_zipcode.json'
    }]),

    // This allows us to reference the generated files from within the template
    // using lodash syntax.
    new HtmlWebpackPlugin({
      inject: false,
      template: 'site/index.html',
    }),

    // Automatically inject Angular dependencies using @ngInject
    new ngAnnotatePlugin({ add: true })
  ]
};
