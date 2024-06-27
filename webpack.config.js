const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const { DefinePlugin } = require('webpack');
const path = require('path');
const deps = require('./package.json').dependencies;
const Dotenv = require('dotenv-webpack');
const chalk = require('chalk');

module.exports = (env) => {
  let mode = null;

  if (env.production) {
    console.log(chalk.green('Production 🚀\n'));
    mode = 'production';
  } else if (env.local) {
    console.log(chalk.blue('Local 🏠\n'));
    mode = 'local';
  } else {
    console.log(chalk.yellow('Development 🛠️\n'));
    mode = 'development';
  }

  const dotenvPath = path.resolve(__dirname, `.env.${mode}`);
  console.log(`Loading .env file from: ${dotenvPath}`);
  require('dotenv').config({ path: dotenvPath });

  const plugins = [
    new HtmlWebPackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[id].[contenthash].css'
    }),
    new ProvidePlugin({
      React: 'react'
    }),
    // new DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify(mode)
    // }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static', // 📊 Генерирует HTML файл с отчетом
      openAnalyzer: false, // 🌐 Открывает отчет автоматически в браузере
      reportFilename: 'bundle_report.html' // 📄 Имя файла отчета
    }),
    new CleanWebpackPlugin(),
    new Dotenv({
      path: path.resolve(__dirname, `.env.${mode}`)
    }),
    new ModuleFederationPlugin({
      name: 'App name', // 📝 Введите название проекта
      filename: 'remoteEntry.js',
      remotes: {},
      exposes: {
        './App': './src/App'
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom']
        },
        axios: {
          requiredVersion: deps.axios,
          eager: env.production,
          singleton: env.production
        }
      }
    })
  ];

  return {
    mode: env.development ? 'development' : 'production',
    entry: ['./src/index.ts'],
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: process.env.PUBLIC_PATH,
      filename: 'js/[name].[contenthash].js',
      chunkFilename: 'js/[id].[contenthash].js'
    },
    devServer: env.development
      ? {
          hot: true,
          port: 3000,
          historyApiFallback: true,
          client: {
            overlay: false
          },
          static: {
            directory: path.join(__dirname, 'public')
          },
          watchFiles: ['src/**/*', 'public/**/*']
        }
      : undefined,
    plugins,
    target: 'web',
    module: {
      rules: [
        {
          test: /\.m?js/,
          type: 'javascript/auto',
          resolve: {
            fullySpecified: false
          }
        },
        {
          test: /\.(css|s[ac]ss)$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          type: 'asset/resource'
        },
        {
          test: /\.svg$/,
          use: 'file-loader'
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[contenthash][ext]'
          }
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src/')
      }
    }
  };
};
