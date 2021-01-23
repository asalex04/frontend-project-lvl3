const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js'
  },
  entry: './src/index.js',
  module: {
    rules: [
      //{ test: /\.svg$/, use: 'svg-inline-loader' },
      { 
        test: /\.css$/, 
        use: [ 'style-loader', 'css-loader' ] 
      },
      // { test: /\.(js)$/, use: 'babel-loader' }
    ]
  },
 
  plugins: [
    new HtmlWebpackPlugin()
  ],
};