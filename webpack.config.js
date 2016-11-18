var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: './js/app.js'
  },

  output: {
    path: './site/assets/javascripts/',
    filename: '[name].js'
  },

  plugins: [
    new CopyWebpackPlugin([
      {
        from: './data/congress.json',
        to: 'congress.json'
      },
    ])
  ]
};
