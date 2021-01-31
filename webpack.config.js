const webpack = require("webpack");
const ejs = require("ejs");
const CopyPlugin = require("copy-webpack-plugin");
const ExtensionReloader = require("webpack-extension-reloader");

const { VueLoaderPlugin } = require("vue-loader");
const { version } = require("./package.json");
const { resolve } = require("path");

const config = {
  mode: process.env.NODE_ENV,
  context: __dirname + "/src/",
  entry: {
    background: "./background",
    "popup/popup": "./popup/popup",
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js", ".vue", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        loader: "svg-url-loader",
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          "vue-style-loader",
          "style-loader",
          "css-loader",
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
              sassOptions: {
                fiber: require("fibers"),
                indentedSyntax: false,
              },
            },
          },
        ],
      },

    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      global: "window",
    }),
    new VueLoaderPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "assets", to: "assets" },
        {
          from: "popup/popup.html",
          to: "popup/popup.html",
          transform: transformHtml,
        },
        {
          from: "manifest.json",
          to: "manifest.json",
          transform: (content) => {
            const jsonContent = JSON.parse(content);
            jsonContent.version = version;

            if (config.mode === "development") {
              jsonContent["content_security_policy"] =
                "script-src 'self' 'unsafe-eval'; object-src 'self'";
            }

            return JSON.stringify(jsonContent, null, 2);
          },
        },
      ],
    }),
  ],
};

if (config.mode === "production") {
  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"production"',
      },
    }),
  ]);
}

if (process.env.HMR === "true") {
  config.plugins = (config.plugins || []).concat([
    new ExtensionReloader({
      manifest: resolve("./src/manifest.json"),
    }),
  ]);
}

function transformHtml(content) {
  return ejs.render(content.toString(), {
    ...process.env,
  });
}

module.exports = config;
