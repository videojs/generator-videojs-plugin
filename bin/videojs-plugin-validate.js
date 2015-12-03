#!/usr/bin/env node

var chalk = require('chalk');
var glob = require('glob');
var path = require('path');
var parser = require('tap-parser');
var test = require('tape');

var tap = test.createStream().pipe(parser());

tap.on('assert', function(assert) {
  var color = assert.ok ? 'green' : 'red';
  var prefix = assert.ok ? '✓' : '⨯';
  process.stdout.write(chalk[color](prefix + ' ' + assert.name) + '\n');
});

glob(path.join(__dirname, '../es5-validate/*.test.js'), function(err, files) {
  if (err) {
    throw err;
  }
  files.forEach(require);
});
