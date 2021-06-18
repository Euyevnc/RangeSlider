const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, './demosrc'),
  demo: path.join(__dirname, './DEMO'),
};

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';
  return {
    entry: './demosrc/demo.ts',
    output: {
      filename: 'index.js',
      path: PATHS.demo,
      publicPath: isProduction ? './' : '/',
    },

    devServer: {
      overlay: true,
      contentBase: 'DEMO',
      watchContentBase: true,
      liveReload: true,
    },
    devtool : "eval",
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'styles.css',
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: `${PATHS.src}/demo.html`,
      }),
    ],
    module: {
      rules: [
        {
          test: require.resolve('jquery'),
          loader: 'expose-loader',
          options: {
            exposes: ['$', 'jQuery'],
          },
        },
        {
          test: /\.d\.ts$/,
          loader: 'ignore-loader',
        },
        {
          test: /(?<!\.d)\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: '/node_modules/',
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,

            {
              loader: 'css-loader', options: { url: true, import: false },
            },
            'sass-loader',
          ],
        },

      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },

  };
};
