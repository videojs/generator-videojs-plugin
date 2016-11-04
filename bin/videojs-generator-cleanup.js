#!/usr/bin/env node

'use strict';

/**
 * Performs cleanup after updating from one major version of the generator to
 * another.
 *
 * @file bin/videojs-generator-cleanup.js
 */
const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');
const semver = require('semver');
const sh = require('shelljs');
const tsmlj = require('tsmlj');

const configs = {
  v2: {
    removals: [
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
  },
  v3: {
    removals: [
      '.babelrc',
      'dist',
      'docs/api',
      'es5',
      'jsdoc.json',
      'scripts/banner.ejs',
      'scripts/build-test.js',
      'scripts/postversion.js',
      'scripts/server.js',
      'scripts/version.js',
      'test/karma.conf.js',
      'test/index.html',
    ],
    renames: {
      'src/plugin.scss': 'src/css/index.scss',
      'src/plugin.js': 'src/js/index.js',
      'test/plugin.test.js': 'test/index.test.js'
    },
    pkg: [
      'browserify',
      'dependencies.browserify-versionify',
      'dependencies.video.js',
      'devDependencies.babel-cli',
      'devDependencies.babel-plugin-transform-es3-member-expression-literals',
      'devDependencies.babel-plugin-transform-es3-property-literals',
      'devDependencies.babel-plugin-transform-object-assign',
      'devDependencies.babel-preset-es2015',
      'devDependencies.babelify',
      'devDependencies.bannerize',
      'devDependencies.bluebird',
      'devDependencies.browserify',
      'devDependencies.browserify-shim',
      'devDependencies.bundle-collapser',
      'devDependencies.budo',
      'devDependencies.doctoc',
      'devDependencies.glob',
      'devDependencies.global',
      'devDependencies.jsdoc',
      'devDependencies.karma',
      'devDependencies.karma-chrome-launcher',
      'devDependencies.karma-detect-browsers',
      'devDependencies.karma-firefox-launcher',
      'devDependencies.karma-ie-launcher',
      'devDependencies.karma-qunit',
      'devDependencies.karma-safari-launcher',
      'devDependencies.lodash',
      'devDependencies.mkdirp',
      'devDependencies.node-sass',
      'devDependencies.semver',
      'devDependencies.npm-run-all',
      'devDependencies.qunitjs',
      'devDependencies.rimraf',
      'devDependencies.sinon',
      'devDependencies.uglify-js',
      'devDependencies.videojs-languages',
      'devDependencies.videojs-standard',
      'scripts.prebuild',
      'scripts.build:css',
      'scripts.build:css:bannerize',
      'scripts.build:css:sass',
      'scripts.build:js',
      'scripts.build:js:babel',
      'scripts.build:js:bannerize',
      'scripts.build:js:browserify',
      'scripts.build:js:collapse',
      'scripts.build:js:uglify',
      'scripts.build:lang',
      'scripts.build:test',
      'scripts.docs',
      'scripts.docs:api',
      'scripts.docs:toc',
      'scripts.prepublish',
      'scripts.pretest',
      'scripts.test:chrome',
      'scripts.test:firefox',
      'scripts.test:ie',
      'scripts.test:safari',
      'scripts.version',
      'style',
      'videojs-plugin',
      'vjsstandard'
    ]
  }
};

const major = semver.major(require(path.join(__dirname, '..', 'package.json')).version);
const config = configs[`v${major}`];

const exists = (fname) => {
  try {
    fs.statSync(path.join(process.cwd(), fname));
    return true;
  } catch (x) {
    return false;
  }
};

if (!config) {
  console.log(chalk.yellow(tsmlj`
    There are no updates to be made from
    v${major ? major - 1 : 0}.x.x to v${major}.x.x
  `));
  process.exit(0);
}

if (config.removals.length) {
  config.removals.filter(exists).forEach(fname => {
    sh.rm('-rf', fname);
    console.log(`Removed "${fname}" from this directory.`);
  });
}

if (config.renames) {
  Object.keys(config.renames).filter(exists).forEach(src => {
    const dest = config.renames[src];

    fs.move(src, dest, {clobber: true}, function(err) {
      if (err) {
        throw err;
      }
      console.log(`Renamed "${src}" to "${dest}.`);
    });
  });
}

if (config.pkg.length) {
  const pkgPath = path.join(process.cwd(), 'package.json');
  const pkg = require(pkgPath);

  config.pkg.forEach(key => {
    if (_.get(pkg, key)) {
      _.set(pkg, key, undefined);
      console.log(`Removed "${key}" from package.json.`);
    }
  });

  fs.writeJsonSync(pkgPath, pkg, {spaces: 2});
}
