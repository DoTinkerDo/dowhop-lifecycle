const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: ['./src/index.jsx'],
  devtool: false,
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'profile_bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  stats: {
    color: true,
    reasons: true,
    chunks: false
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader?limit=1024&name=images/[name].[ext]'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  plugins:
    process.env.NODE_ENV === 'production'
      ? [
          new webpack.optimize.OccurrenceOrderPlugin(),
          new webpack.DefinePlugin({
            'process.env': {
              NODE_ENV: JSON.stringify('production')
            }
          }),
          new webpack.optimize.UglifyJsPlugin()
        ]
      : [new HtmlWebpackPlugin({ template: 'my-profile.template.html', filename: 'my-profile.html', hash: true })]
};
