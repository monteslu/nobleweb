'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    main: path.join(__dirname, './src/main.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, './')
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  plugins: [
    new webpack.IgnorePlugin(/^fs$/),
    new webpack.IgnorePlugin(/^tls$/),
    new webpack.IgnorePlugin(/^README\.md$/)
  ],
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: "json"
      }
    ]
  },
  resolve: {
    // this is a workaround for aliasing a top level dependency
    // inside a symlinked subdependency
    root: path.join(__dirname, 'node_modules'),
    alias: {
      // replacing `fs` with a browser-compatible version
      // net: 'chrome-net',
      // fs: 'level-fs-browser',
      // serialport: 'browser-serialport',
    }
  },
  bail: false
};
