var path = require('path');
module.exports = {
  node: {
    fs: "empty"
  },
  entry: {
    main: [
//      '@babel/polyfill', // might be needed in the future
      './source/index.js'
    ]
  },
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: __dirname,
    filename: 'browser/updater.js',
    libraryTarget: 'window',
    library: "lformsUpdater"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
