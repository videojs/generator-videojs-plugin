#!/usr/bin/env node

var chalk = require('chalk');
var glob = require('glob');
var path = require('path');
var parser = require('tap-parser');
var tap = require('tap');

var tests = tap.unpipe(process.stdout).pipe(parser());

tests.on('assert', function(assert) {
  var color = assert.ok ? 'green' : 'red';
  var prefix = assert.ok ? '✓' : '⨯';
  process.stdout.write(chalk[color](prefix + ' ' + assert.name) + '\n');
});

glob(path.join(__dirname, '../es5-check/*.test.js'), function(err, files) {
  if (err) {
    throw err;
  }
  files.forEach(require);
});
