var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var minimize = process.argv.indexOf('--minimize') !== -1;

var jsOutput = 'wood.js';
var cssOutput = 'wood.css';
var plugins = [
  new webpack.NoErrorsPlugin()
];

if (minimize) {
  jsOutput = 'wood.min.js';
  cssOutput = 'wood.min.css';
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

plugins.push(new ExtractTextPlugin('css/' + cssOutput));

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/' + jsOutput
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: 'es2015'
      }
    }, {
      test: /\.(woff|woff2|eot|ttf|truetype|svg)$/,
      loader: 'url-loader?limit=1024&name=../fonts/[name].[ext]'
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract(
        'style',
        'css!sass')
    }]
  },
  plugins: plugins,
  stats: {
    // Nice colored output
    colors: true
  },
  // Create Sourcemaps for the bundle
  devtool: 'source-map'
};
