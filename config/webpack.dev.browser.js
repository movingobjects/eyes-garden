
const { DefinePlugin } = require('webpack'),
      merge            = require('webpack-merge'),
      common           = require('./webpack.common.js');

module.exports = merge(common, {

  devtool: 'inline-cheap-source-map',

  plugins: [
    new DefinePlugin({
      IS_ELECTRON: false,
      IS_DEV: true,
      __DEV__: true,
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    })
  ],

});
