const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: [
    './src/front/js/index.js'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      }, //css only files
      {
        test: /\.(png|svg|jpg|gif|jpeg|webp)$/, use: {
          loader: 'file-loader',
          options: { name: '[name].[ext]' }
        }
      }, //for images
      { test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/, use: ['file-loader'] } //for fonts
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx', '.json']
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: 'Datacloth.ico',
      template: 'template.html'
    }),
    new Dotenv({ safe: true, systemvars: true })
  ]
};