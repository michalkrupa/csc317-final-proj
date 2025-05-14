const { merge } = require("webpack-merge");
const common = require("./webpack.common");

const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");

module.exports = merge(common({ production: true }), {
  output: {
    path: path.resolve(__dirname, "public/dist"),  // Correct path resolution
    filename: "main.[contenthash].js", // Use contenthash for production
  },
  mode: "production",
  devtool: false, // No source maps in production
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },
});
