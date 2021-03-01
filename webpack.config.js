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
      { 
        test: /\.css$/, 
        use: [ 'style-loader', 'css-loader' ] 
      },
    ]
  },
 
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
  
  performance: {
    hints: false
  }
};