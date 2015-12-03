#!/usr/bin/env node

var faucet = require('faucet');
var glob = require('glob');
var path = require('path');
var test = require('tape');

test.createStream().pipe(faucet()).pipe(process.stdout);

glob(path.join(__dirname, '../es5-validate/*.test.js'), function(err, files) {
  if (err) {
    throw err;
  }
  files.forEach(require);
});
