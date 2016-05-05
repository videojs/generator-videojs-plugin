#!/usr/bin/env node

var chalk = require('chalk');
var fs = require('fs-extra');
var _ = require('lodash');
var path = require('path');
var semver = require('semver');
var sh = require('shelljs');

var configs = {
  v2: {
    files: [
      'dist-test',
      'test/karma',
      'scripts/npm-postversion-for-bower.sh',
      'scripts/npm-preversion-for-bower.sh',
      'scripts/npm-version-for-bower.sh',
    ],
    pkg: [
      'devDependencies.connect',
      'devDependencies.cowsay',
      'devDependencies.karma-browserify',
      'devDependencies.lodash-compat',
      'devDependencies.minimist',
      'devDependencies.portscanner',
      'devDependencies.serve-static',
      'devDependencies.watchify',
      'scripts.build:test:browserify',
      'scripts.mkdirs',
      'scripts.prestart',
      'scripts.start:serve',
      'scripts.watch',
      'scripts.watch:css',
      'scripts.watch:js',
      'scripts.watch:test'
    ]
  }
};

var major = semver.major(require('../package.json').version);
var config = configs['v' + major];
var files, filename, pkg;

if (!config) {
  console.log(
    chalk.yellow('There are no updates to be made from v%s.x.x to v%s.x.x'),
    major ? major - 1 : 0,
    major
  );
  process.exit();
}

if (Array.isArray(config.files) && config.files.length) {
  files = config.files.filter(function(f) {
    try {
      fs.statSync(path.join(process.cwd(), f));
      return true;
    } catch (x) {
      return false;
    }
  });

  sh.rm('-rf', files);

  files.forEach(function(f) {
    console.log('Removed "' + f + '" from this directory');
  });
}

if (Array.isArray(config.pkg) && config.pkg.length) {
  filename = path.join(process.cwd(), 'package.json');
  pkg = require(filename);

  config.pkg.forEach(function(p) {
    if (_.get(pkg, p)) {
      _.set(pkg, p, undefined);
      console.log('Removed "' + p + '" from package.json');
    }
  });

  fs.writeJsonSync(filename, pkg, {spaces: 2});
}

console.log(chalk.green('Done!'));
