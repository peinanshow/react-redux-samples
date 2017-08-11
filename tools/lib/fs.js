/*
 * Forked from React Starter Kit
 * https://github.com/kriasoft/react-starter-kit/
 */

import fs from 'fs';
import mkdirp from 'mkdirp';
import glob from 'glob';
import path from 'path';

export const copyFile = (source, target) => new Promise((resolve, reject) => {
  let cbCalled = false;
  function done(err) {
    if (!cbCalled) {
      cbCalled = true;
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    }
  }

  const rd = fs.createReadStream(source);
  rd.on('error', err => done(err));
  const wr = fs.createWriteStream(target);
  wr.on('error', err => done(err));
  wr.on('close', err => done(err));
  rd.pipe(wr);
});

export const writeFile = (file, contents) => new Promise((resolve, reject) => {
  fs.writeFile(file, contents, 'utf8', err => (err ? reject(err) : resolve()));
});

export const makeDir = name => new Promise((resolve, reject) => {
  mkdirp(name, err => (err ? reject(err) : resolve()));
});

export const readDir = (pattern, options) => new Promise((resolve, reject) =>
  glob(pattern, options, (err, result) => (err ? reject(err) : resolve(result))),
);

export const copyDir = async (source, target, mask = '**/*.*') => {
  const dirs = await readDir(mask, {
    cwd: source,
    nosort: true,
    dot: true,
  });
  await Promise.all(dirs.map(async (dir) => {
    const from = path.resolve(source, dir);
    const to = path.resolve(target, dir);
    await makeDir(path.dirname(to));
    await copyFile(from, to);
  }));
};

export default { copyDir, writeFile, makeDir };
