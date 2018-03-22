const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const package = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


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
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':data-src']
          }
        }
      },
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
                sourceMap: true
              }
            }]
        })
      }
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
      title: 'Lines and Lines and Lines',
      template: path.resolve(__dirname, 'src/index.html')
    }),
    extractCss
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