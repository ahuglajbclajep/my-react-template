const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

/** @type {(env: object, argv: { mode?: string }) => import("webpack").Configuration} */
module.exports = (env, { mode }) => {
  const dev = mode !== "production";
  return {
    // see https://github.com/webpack/webpack-dev-server/issues/1327
    mode: "development",
    entry: "./src/index",
    module: {
      rules: [
        {
          test: /\.[tj]sx?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },
    plugins: [
      // see https://github.com/jantimon/html-webpack-plugin/issues/1387
      new HtmlWebpackPlugin({ template: "src/index.ejs" }),
      new MiniCssExtractPlugin(),
    ],
    resolve: { extensions: [".ts", ".tsx", ".js", ".jsx"] },
    optimization: { minimizer: ["...", new CssMinimizerPlugin()] },
    devtool: dev ? "eval-source-map" : false,
    devServer: {
      // host: "0.0.0.0", // for debugging on mobile devices
      historyApiFallback: true,
      contentBase: "./public", // for static file serving
      // watchContentBase: true,
      overlay: true,
    },
  };
};
