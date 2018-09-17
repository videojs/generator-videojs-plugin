/* eslint-disable no-console */

const spawnSync = require('child_process').spawnSync;
const path = require('path');

const result = spawnSync('npm', ['i', '--package-lock-only'], {stdio: 'inherit', cwd: path.join(__dirname, '..', 'plugin')});

if (result.status !== 0) {
  const error = result.stderr.toString().trim();

  console.error(`Generate package lock failed with error:\n\n${error}\n`);
}
