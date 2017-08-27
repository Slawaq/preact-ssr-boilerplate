const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const outputFolder = path.resolve(__dirname, '..', 'build')

module.exports = {
  output: {
    path: path.resolve(__dirname, outputFolder)
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {
                useBuiltIns: true
              }]
            ],
            plugins: [
              ['babel-plugin-transform-react-jsx', { pragma: 'h' }],
              ['babel-plugin-transform-class-properties'],
              ['babel-plugin-transform-runtime', {
                regenerator: true,
                helpers: false,
                polyfill: false
              }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[local]__[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: (loader) => [
                  require('postcss-import')({ root: loader.resourcePath }),
                  require('postcss-flexbugs-fixes')(),
                  require('postcss-flexboxfixer')(),
                  require('autoprefixer')()
                ]
              }
            }
          ]
        })
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /favicon\.(png|jpg|gif)$/,
        use: 'file-loader?name=favicon.[ext]'
      },
      {
        test: /\.svg/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 26000,
              mimetype: 'image/svg+xml'
            }
          }
        ]
      }, {
        test: /\.(woff|woff2|ttf|eot)/,
        loader: 'file-loader'
      }
    ]
  }
}
