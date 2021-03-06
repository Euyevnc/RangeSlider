const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PATHS = {
  dist: path.join(__dirname, './dist'),
};

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';
  return {
    entry: './src/index.ts',
    output: {
      filename: 'index.js',
      path: PATHS.dist,
      publicPath: isProduction ? './' : '/',
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: 'styles.css',
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
      extensions: ['.ts'],
    },

  };
};
