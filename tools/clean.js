/*
 * Forked from React Starter Kit
 * https://github.com/kriasoft/react-starter-kit/
 */

import del from 'del';
import fs from './lib/fs';

/**
 * Cleans up the output (build) directory.
 */
async function clean() {
  await del([
    '.tmp',
    'i18n/extractedMessages/*',
    'build/*',
    '!build/.git',
    'src/config.js',
  ], { dot: true });
  await fs.makeDir('build');
}

export default clean;
