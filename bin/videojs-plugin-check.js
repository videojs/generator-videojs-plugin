#!/usr/bin/env node

/* eslint-env node */
/* eslint no-console: "off" */

const chalk = require('chalk');
const glob = require('glob');
const path = require('path');
const parser = require('tap-parser');
const tap = require('tap');

// Writes out a flat list of assertion results. That's all we really want
// because the plugin check is not testing code, but the presence of certain
// files or text within files.
tap
  .unpipe(process.stdout)
  .pipe(parser())
  .on('assert', (assert) => {
    const color = assert.ok ? 'green' : 'red';
    const prefix = assert.ok ? '✓' : '⨯';

    console.log(chalk[color](prefix + ' ' + assert.name));
  });

glob(path.join(__dirname, '../check/*.test.js'), (err, files) => {
  if (err) {
    throw err;
  }
  files.forEach(require);
});
