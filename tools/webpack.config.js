import path from 'path';
import webpack from 'webpack';
import { settings } from '../src/config.js';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');

// Browsers that this project supports
// See https://github.com/ai/browserslist for syntax
const AUTOPREFIXER_BROWSERS = [
  'last 2 versions',
  '> 5%',
  'IE >= 9',
];

const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  __DEV__: DEBUG,
};

const config = {
  cache: DEBUG,
  debug: DEBUG,

  context: path.resolve(__dirname, '../src'),

  entry: {
    app: DEBUG
      ? ['webpack-hot-middleware/client', './client.js']
      : ['./client.js'],
  },

  output: {
    publicPath: './',
    path: path.join(__dirname, '../build'),
    filename: DEBUG ? '[name].js?[hash]' : '[name].[chunkhash].js',
    chunkFilename: DEBUG ? '[name].[id].js?[hash]' : '[name].[id].[chunkhash].js',
  },

  // Choose a developer tool to enhance debugging
  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: DEBUG ? 'source-map' : false,

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: ['babel-loader'], // Turn ES6 code into vanilla ES5 using Babel.
        include: path.resolve(__dirname, '../src/'),
        query: {
          cacheDirectory: DEBUG,
          babelrc: false,
          presets: ['react', 'es2015', 'stage-0'],
          plugins: [
            'transform-runtime',
            // Extracts string messages for translation from modules that use React Intl.
            ['react-intl', { messagesDir: './i18n/extractedMessages/' }],
            ...(DEBUG ? [
              ['react-transform', {
                transforms: [{
                  transform: 'react-transform-hmr',
                  imports: ['react'],
                  locals: ['module'],
                }, {
                  transform: 'react-transform-catch-errors',
                  imports: ['react', 'redbox-react'],
                }],
              }],
            ] : []),
          ],
        },
      }, {
        test: /\.scss$/,
        loaders: [
          'style-loader', // Add exports of a module as style to DOM
          `css-loader?${JSON.stringify({
            sourceMap: DEBUG,
            modules: true,
            localIdentName: DEBUG ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',
            minimize: !DEBUG,
          })}`,
          'postcss-loader?parser=postcss-scss',
        ],
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader?limit=10000',
      }, {
        test: /\.(eot|ttf|svg|woff|woff2|wav|mp3)$/,
        loader: 'file-loader',
      },
    ],
  },

  resolve: {
    root: path.resolve(__dirname, '../src'),
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx', '.json'],
  },

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },

  plugins: [

    // Define free variables
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({ ...GLOBALS, 'process.env.BROWSER': true }),

    // Generates a solid base html page for your web application with
    // all your webpack generated css and js files built in.
    new HtmlWebpackPlugin({
      config: settings,
      inject: 'body',
      template: ('./public/index.html'),
      minify: !DEBUG && { collapseWhitespace: true, minifyCSS: true },
    }),

    ...(DEBUG ? [
      // Enables Hot Module Replacement.
      new webpack.HotModuleReplacementPlugin(),
    ] : [
      // Assign the module and chunk ids by occurrence count
      // Consistent ordering of modules required if using any hashing ([hash] or [chunkhash])
      // https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
      new webpack.optimize.OccurenceOrderPlugin(true),

      // Search for equal or similar files and deduplicate them in the output.
      new webpack.optimize.DedupePlugin(),

      // Minimize all JavaScript output of chunks.
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true, // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
          warnings: VERBOSE,
        },
      }),

      // A plugin for a more aggressive chunk merging strategy.
      // Even similar chunks are merged if the total size is reduced enough.
      new webpack.optimize.AggressiveMergingPlugin(),
    ]),
  ],

  postcss: function plugins(bundler) {
    return [
      require('postcss-import')({ addDependencyTo: bundler }),
      require('precss')(),
      require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS }),
    ];
  },
};

export default config;
