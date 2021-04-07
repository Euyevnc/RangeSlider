const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PATHS = {
  dist: path.join(__dirname,  './dist'),
  demo: path.join(__dirname,  './DEMO')
}
const forDemo = false

module.exports = (env, options) =>{
  const isProduction = options.mode == 'production'
   return{
    entry: forDemo ? './demosrc/demo.ts' : './src/index.ts',
    output: {
      filename: 'index.js',
      path: forDemo ? PATHS.demo : PATHS.dist,
      publicPath: isProduction ? './' : '/',
    },	

    devServer: {
      overlay: true,
      contentBase: 'DEMO',
      watchContentBase: true,
      liveReload: true,
    },
    // devtool : "eval",
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'styles.css',
      }),
    ],
    module:{
      rules: [
        {
          test: require.resolve("jquery"),
          loader: "expose-loader",
          options: {
            exposes: ["$", "jQuery"],
          },
        },
        {
          test: /\.d\.ts$/,
          loader: 'ignore-loader'
        },
        {
          test: /(?<!\.d)\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: '/node_modules/'
        },
        {
          test:/\.s[ac]ss$/i,
          use: [
             MiniCssExtractPlugin.loader,

            {
              loader: 'css-loader', options: {url: true, import: false}
            },
            'sass-loader',
          ]
        },
        
      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js'],
    },

  }
}

