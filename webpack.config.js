const HTMLWebpackPlugin = require('html-webpack-plugin')
const path = require('path')


module.exports = {
  entry: './src/index.js',
  output: { path: path.resolve(__dirname, "dist"), filename: "main.js" },

  experiments: {
    topLevelAwait: true
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: ["babel-loader"]
    },
    ],
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html")
  })
  ],
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
}
