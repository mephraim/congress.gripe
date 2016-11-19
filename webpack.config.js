var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
var path = require('path');

module.exports = {
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
    new CopyWebpackPlugin([{
      from: './site/index.html',
      to: 'index.html'
    }]),

    new ExtractTextPlugin('assets/main.css'),
    new ngAnnotatePlugin({ add: true })
  ],

  devServer: {
    inline: true
  }
};
