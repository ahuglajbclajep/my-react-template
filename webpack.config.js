const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin"); // from webpack
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

/** @type {(env: typeof process.env, argv: { mode: string }) => import("webpack").Configuration} */
module.exports = (env, { mode }) => {
  const dev = mode === "development";
  return {
    mode: "development",
    entry: "./src/index.tsx",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader"
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, `css-loader?sourceMap=${dev}`]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        template: "src/index.ejs",
        title: process.env.npm_package_name
      })
    ],
    resolve: { extensions: [".ts", ".tsx", ".js"] },
    optimization: {
      minimizer: [new TerserPlugin(), new OptimizeCssAssetsPlugin()]
    },
    devtool: dev ? "inline-source-map" : "none",
    devServer: {
      contentBase: "./dist",
      overlay: true,
      watchContentBase: true
    }
  };
};
