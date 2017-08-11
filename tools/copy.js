/*
 * Forked from React Starter Kit
 * https://github.com/kriasoft/react-starter-kit/
 */

import chokidar from 'chokidar';
import path from 'path';
import { writeFile, copyFile, makeDir, copyDir, cleanDir } from './lib/fs';
import { format } from './run';
const DEBUG = !process.argv.includes('--release');
/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
async function copy() {
  await makeDir('build');
  await Promise.all([
    // copyFile('LICENSE.md', 'build/LICENSE.txt'),
    copyDir('src/public', 'build'),
    copyDir('i18n', 'build/i18n', '*.json'),
    copyFile('web.config', 'build/web.config'),
  ]);

  if(DEBUG){
    await copyFile('src/config-dev.js', 'src/config.js');
  }else {
    await copyFile('src/config-dev.js', 'src/config.js');
  }

  if (process.argv.includes('--watch')) {
    const watcher = chokidar.watch([
      'public/**/*',
      'i18n/*.json',
    ], { ignoreInitial: true });

    watcher.on('all', async (event, filePath) => {
      const start = new Date();
      const src = path.relative('./', filePath);
      const dist = path.join('build/', src.startsWith('src') ? path.relative('src', src) : src);
      switch (event) {
        case 'add':
        case 'change':
          await makeDir(path.dirname(dist));
          await copyFile(filePath, dist);
          break;
        case 'unlink':
        case 'unlinkDir':
          cleanDir(dist, { nosort: true, dot: true });
          break;
        default:
          return;
      }
      const end = new Date();
      const time = end.getTime() - start.getTime();
      console.log(`[${format(end)}] ${event} '${dist}' after ${time} ms`);
    });
  }
}

export default copy;
