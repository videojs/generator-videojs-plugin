#!/usr/bin/env node

var chalk = require('chalk');
var glob = require('glob');
var path = require('path');
var parser = require('tap-parser');
var tap = require('tap');

// Writes out a flat list of assertion results. That's all we really want
// because the plugin check is not testing code, but the presence of certain
// files or text within files.
tap.unpipe(process.stdout).pipe(parser()).on('assert', function(assert) {
  var color = assert.ok ? 'green' : 'red';
  var prefix = assert.ok ? '✓' : '⨯';
  console.log(chalk[color](prefix + ' ' + assert.name));
});

glob(path.join(__dirname, '../es5-check/*.test.js'), function(err, files) {
  if (err) {
    throw err;
  }
  files.forEach(require);
});
