const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  entry: slsw.lib.entries,
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx", ".json", ".html"],
    modules: ["node_modules"]
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js"
  },
  target: "node",
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: "file-loader?name=public/images/[name].[ext]",
        include: [path.resolve(__dirname, "public")]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: "file-loader?name=client/build/static/media/[name].[ext]",
        include: [path.resolve(__dirname, "client")]
      }
    ]
  },
  watch: true,
  // Since 'aws-sdk' is not compatible with webpack,
  // we exclude all node dependencies
  externals: [nodeExternals()],
  optimization: {
    // We no not want to minimize our code.
    minimize: false
  },
  performance: {
    // Turn off size warnings for entry points
    hints: false
  },
  node: {
    __dirname: false
  },
  plugins: [
    new CopyPlugin([
      {
        from: "public",
        to: "public"
      },
      {
        from: "client/build",
        to: "client/build"
      },
      {
        from: "shopifyApi",
        to: "shopifyApi"
      },
      {
        from: "emailTemplates",
        to: "emailTemplates"
      },
      {
        from: "db",
        to: "db"
      },
      {
        from: "config",
        to: "config"
      },
      {
        from: "emailService",
        to: "emailService"
      },

    ])
  ]
};
