const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    'index': './src/js/index.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name].[chunkhash].js',
    publicPath: '/'
  },
  devServer: {
    overlay: true
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: true
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {importLoaders: 1}
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  browsers: ['> 1%', 'last 2 versions', 'firefox >= 4', 'safari 7', 'safari 8', 'IE 8', 'IE 9', 'IE 10', 'IE 11'],
                }),
              ],
            },
          },
          "sass-loader",
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                './src/scss/colors.scss',
                './src/scss/mixins.scss',
              ],
            },
          },
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img/',
            },
          },
          {
            loader: 'img-loader',
            options: {
              enabled: true,
            },
          },
        ],
      },
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin(),
      new OptimizeCssAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          discardComments: {
            removeAll: true
          }
        },
        canPrint: true,
      })
    ],
    splitChunks: {
      cacheGroups: {
        default: false,
        styles: {
          name: 'style',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin('dist'),

    new MiniCssExtractPlugin({
      filename: "css/[name].css"
    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['index', 'common'],
      template: './src/views/index.pug'
    })
  ]
};