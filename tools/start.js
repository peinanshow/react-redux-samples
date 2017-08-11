import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack.config.js';
import run from './run';

process.argv.push('--watch');

const host = 'localhost';
const port = '5000';
const compiler = webpack(webpackConfig);


async function server() {
  await run(require('./build'));

  browserSync({
    host,
    port,
    notify: false,
    ui: false,
    server: {
      baseDir: 'build',
      middleware: [
        webpackDevMiddleware(compiler, {
          hot: true,
          publicPath: `http://${host}:${port}/`,
          stats: { colors: true },
        }),
        webpackHotMiddleware(compiler),
      ],
    },

    // no need to watch '*.js' here, webpack will take care of it for us,
    // including full page reloads if HMR won't work
    files: [
      'build/*.css',
      '!build/index.html',
    ],
  });
}

export default server;
