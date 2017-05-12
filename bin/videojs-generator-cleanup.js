#!/usr/bin/env node

'use strict';

/* eslint no-console: "off" */

const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');
const semver = require('semver');
const rimraf = require('rimraf');

const configs = {
  v2: {
    files: [
      'dist-test',
      'test/karma',
      'scripts/npm-postversion-for-bower.sh',
      'scripts/npm-preversion-for-bower.sh',
      'scripts/npm-version-for-bower.sh'
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

const major = semver.major(require('../package.json').version);
const config = configs['v' + major];

if (!config) {
  console.log(
    chalk.yellow('There are no updates to be made from v%s.x.x to v%s.x.x'),
    major ? major - 1 : 0,
    major
  );
  process.exit();
}

if (Array.isArray(config.files) && config.files.length) {
  const files = config.files.filter(function(f) {
    try {
      fs.statSync(path.join(process.cwd(), f));
      return true;
    } catch (x) {
      return false;
    }
  });

  rimraf(files);

  files.forEach(function(f) {
    console.log('Removed "' + f + '" from this directory');
  });
}

if (Array.isArray(config.pkg) && config.pkg.length) {
  const filename = path.join(process.cwd(), 'package.json');
  const pkg = require(filename);

  config.pkg.forEach(function(p) {
    if (_.get(pkg, p)) {
      _.set(pkg, p, undefined);
      console.log('Removed "' + p + '" from package.json');
    }
  });

  fs.writeJsonSync(filename, pkg, {spaces: 2});
}

console.log(chalk.green('Done!'));
