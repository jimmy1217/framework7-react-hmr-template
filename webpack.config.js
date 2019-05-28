const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
// const CompressionPlugin = require('compression-webpack-plugin')
// const CleanWebpackPlugin = require('clean-webpack-plugin')
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
// const CopyWebpackPlugin = require('copy-webpack-plugin')
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin");

const config = (env, argv) => {
  const isDev = argv.mode === "development";

  const plugins = [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(argv.mode)
      }
    }),
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // new CleanWebpackPlugin(['build']),
    new ProgressBarPlugin(),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      },
      hash: true,
      cache: false
    }),
    new webpack.HotModuleReplacementPlugin()
  ];

  /** 等 nginx 有支援 static gzip 時再解開 */
  // if (!isDev) {
  //     plugins.push(new CompressionPlugin({
  //         asset: "[path].gz[query]",
  //         algorithm: "gzip",
  //         test: /\.js$|\.css$|\.html$/,
  //         threshold: 4000,
  //         minRatio: 0.8
  //     }))
  // }

  return {
    mode: isDev ? "development" : "production",
    optimization: {
      splitChunks: {
        chunks: "all"
      },
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            ecma: 6
          }
        }),
        // new UglifyJSPlugin({
        //   uglifyOptions: {
        //     compress: {
        //       drop_console: true
        //     },
        //     output: {
        //       comments: false
        //     }
        //   }
        // })
      ]
    },
    entry: {
      app: [path.resolve(__dirname, "./src/index.js")]
    },
    output: {
      path: path.resolve(__dirname, "./build/"),
      // publicPath: "http://localhost:3001/",
      filename: "[name].js"
    },
    devtool: isDev ? "source-map" : false,
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                plugins: () => [require("autoprefixer")]
              }
            }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            "style-loader", // creates style nodes from JS strings
            "css-loader", // translates CSS into CommonJS
            {
              loader: "postcss-loader",
              options: {
                plugins: () => [require("autoprefixer")]
              }
            },
            "sass-loader" // compiles Sass to CSS
          ]
        },
        {
          test: /\.(js|jsx)$/,
          loader: require.resolve("babel-loader"),
          exclude: /node_modules/,
          options: {
            cacheDirectory: true,
            plugins: ["react-hot-loader/babel"]
          }
        },

        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: { minimize: true }
            }
          ]
        },
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          loader: "url-loader",
          options: {
            limit: 30000,
            name: "assets/[name].[ext]"
          }
        }
      ]
    },
    plugins,
    devServer: {
      contentBase: path.join(__dirname, "build"),
      compress: true,
      port: 9002,
      inline: true,
      hot: true
    },
    resolve: {
      // import alias
      alias: {
        // api: path.resolve(__dirname, './src/action/api.js'),
        // components: path.resolve(__dirname, './src/components/'),
        // containers: path.resolve(__dirname, './src/containers/'),
        // common: path.resolve(__dirname, './src/components/common'),
        // actions: path.resolve(__dirname, './src/actions/'),
        // config: path.resolve(__dirname, './src/config/'),
        // store: path.resolve(__dirname, './src/store/'),
        // storeAction: path.resolve(__dirname, './src/store/storeAction'),
        // basicAction: path.resolve(__dirname, './src/store/basicListAction'),
        // basicDetailAction: path.resolve(__dirname, './src/store/basicDetailAction'),
        // helpers: path.resolve(__dirname, './src/helpers'),
        // constants: path.resolve(__dirname, './src/constants'),
        "react-dom": "@hot-loader/react-dom"
      },
      // // import 時可不寫附檔名
      extensions: [".js", ".jsx", ".css", ".scss", ".json"]
    }
  };
};

module.exports = config;
