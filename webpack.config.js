var path = require('path');
var webpack = require('webpack');
var pkg = require('./package.json');
var merge = require('webpack-merge');

var banner =
  pkg.name + ' - ' + pkg.description + '\n' +
  'Author: ' + pkg.author + '\n' +
  'Version: v' + pkg.version;

var config = {
  entry: {
    healthKit: ['./src/index.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
    filename: 'index.debug.js',
    library: ['luna', '[name]'],
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.BannerPlugin(banner)
  ]
};

// 压缩版
var minConfig = merge(config, {
  output: {
    filename: 'index.js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
});

module.exports = [config, minConfig];
