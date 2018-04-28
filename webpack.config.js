const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const ExtractCss = new ExtractTextPlugin('[name].css');
const ExtractHtml = new ExtractTextPlugin('[name].html');

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
  entry: {
    main: path.join(__dirname, 'src', 'index.js'),
    // these two will create extra .js files
    style: path.join(__dirname, 'styles', 'index.scss'),
    index: path.join(__dirname, 'views', 'index.pug'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.(txt)$/,
        use: 'raw-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
      {
        test: /\.pug$/,
        use: ExtractHtml.extract({
          use: ['raw-loader', 'pug-html-loader']
        })
      },
      {
        test: /\.(s[ca]|c)ss$/,
        use: ExtractCss.extract({
          use: ['css-loader', 'sass-loader', 'postcss-loader']
        })
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    host: '0.0.0.0', // so I can test on other devices
  },
  plugins: [
    ExtractCss,
    ExtractHtml,
    new webpack.DefinePlugin({
      NODE_ENV: process.env.NODE_ENV,
    }),
    // any extra assets can be placed here
    new CopyWebpackPlugin([
      path.resolve(__dirname, 'public'),
    ]),
  ],
};
