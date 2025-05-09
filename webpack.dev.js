const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const path = require("path");

module.exports = merge(common({ production: false }), {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 8080,
    hot: true,
    liveReload: true,
    devMiddleware: {
      publicPath: "/dist/",
      writeToDisk: true, // Write files to disk
    },
    proxy: [
      {
        context: ['/'],
        target: 'http://localhost:3000',
        secure: false,
      }
    ],
    historyApiFallback: true,
  },
});
