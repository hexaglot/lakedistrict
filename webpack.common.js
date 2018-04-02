const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const package = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');

const extractCss = new ExtractTextPlugin({
  filename: "styles.css",
  allChunks: true,
});

module.exports = {
  entry: {
    app: './src/index.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: extractCss.extract({
          use: [
            {
              loader: 'typings-for-css-modules-loader',
              options: {
                sourceMap: true,
                modules: true,
                namedExport: true,
                camelCase: true
              }
            }]
        })
      },
      {
        test: /\.less$/,
        use: extractCss.extract({
          use: [
            {
              loader: 'typings-for-css-modules-loader',
              options: {
                sourceMap: true,
                modules: true,
                namedExport: true,
                camelCase: true
              }
            },
            {
              loader: "less-loader", options: {
                strictMath: true,
                noIeCompat: true
              }
            }]
        })
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    // new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html')
    }),
    extractCss,
    new CopyWebpackPlugin([
      { from: 'src/data', to: 'data' }
    ]),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
  },
};