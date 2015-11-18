'use strict';

var _ = require('lodash');
var util = require('util');

var gruntify = function(scripts) {
  var result = {};
  scripts.forEach(function(script) {
    result[script] = 'grunt ' + script;
  });
  return result;
};

/**
 * Replaces each "%s" in the string with the package name from the context.
 *
 * @example
 *   nameify('foo %s bar %s', {packageName: 'baz'}) === 'foo baz bar baz'
 * @param  {String} string
 * @param  {Object} context
 * @return {String}
 */
var nameify = function(string, context) {
  var args = [string];
  string.match(/%s/g).forEach(function() {
    args.push(context.packageName);
  });
  return util.format.apply(util, args);
};

var KARMA_BROWSERS = ['chrome', 'firefox', 'ie', 'opera', 'safari'];

var PACKAGE = {

  /**
   * Common package.json properties.
   *
   * @function common
   * @param    {Object} context
   *           Rendering context passed in by the generator.
   * @return   {Object}
   */
  common: function(context) {
    var pkg = {
      name: context.packageName,
      author: context.author,
      license: context.licenseName,
      version: '0.0.0',
      main: 'src/plugin.js',
      keywords: [
        'videojs',
        'videojs-plugin'
      ],
      'browserify-shim': {
        'qunit': 'global:QUnit',
        'sinon': 'global:sinon',
        'video.js': 'global:videojs'
      },
      standard: {
        ignore: [
          '**/dist/',
          'docs'
        ]
      },
      scripts: {
        'docs': 'documentation src/*.js -f html -o docs/api',
        'lint': 'standard .',
        'preversion': './scripts/npm-preversion.sh',
        'version': './scripts/npm-version.sh',
        'postversion': './scripts/npm-postversion.sh'
      },
      dependencies: {},
      devDependencies: {
        'babel': '^5.8.0',
        'babelify': '^6.0.0',
        'browserify': '^11.0.0',
        'browserify-shim': '^3.0.0',
        'documentation': '^3.0.0',
        'global': '^4.3.0',
        'karma': '^0.13.0',
        'karma-browserify': '^4.4.0',
        'karma-chrome-launcher': '^0.2.0',
        'karma-detect-browsers': '^2.0.0',
        'karma-firefox-launcher': '^0.1.0',
        'karma-ie-launcher': '^0.2.0',
        'karma-opera-launcher': '^0.3.0',
        'karma-qunit': '^0.1.0',
        'karma-safari-launcher': '^0.1.0',
        'npm-run-all': '^1.2.0',
        'qunitjs': '^1.0.0',
        'sinon': '^1.0.0',
        'video.js': '^5.0.0',
        'videojs-standard': '^3.7.0'
      }
    };

    if (context.private) {
      pkg.private = true;
    }

    return pkg;
  },

  /**
   * Grunt build-specific package.json properties.
   *
   * @function grunt
   * @param    {Object} context
   *           Rendering context passed in by the generator.
   * @return   {Object}
   */
  grunt: function() {
    var result = {
      scripts: gruntify([
        'build',
        'build:js',
        'build:test',
        'clean',
        'start',
        'test',
        'watch',
        'watch:js',
        'watch:test'
      ]),
      devDependencies: {
        'grunt': '^0.4.0',
        'grunt-browserify': '^4.0.1',
        'grunt-concurrent': '^2.0.3',
        'grunt-contrib-clean': '^0.6.0',
        'grunt-contrib-connect': '^0.11.2',
        'grunt-contrib-uglify': '^0.9.2',
        'grunt-karma': '^0.12.0',
        'grunt-run': '^0.5.2',
        'load-grunt-tasks': '^3.1.0',
        'time-grunt': '^1.2.0'
      }
    };

    // Create scripts for each Karma browser.
    KARMA_BROWSERS.forEach(function(browser) {
      result.scripts['test:' + browser] = 'grunt test:' + browser;
    });

    return result;
  },

  /**
   * Grunt build-specific package.json properties (with Sass support).
   *
   * @function grunt+sass
   * @param    {Object} context
   *           Rendering context passed in by the generator.
   * @return   {Object}
   */
  'grunt+sass': function() {
    return {
      scripts: gruntify([
        'build:css',
        'watch:css'
      ]),
      devDependencies: {
        'grunt-banner': '^0.6.0',
        'grunt-sass': '^1.0.0',
        'grunt-contrib-watch': '^0.6.0'
      }
    };
  },

  /**
   * npm build-specific package.json properties.
   *
   * @function npm
   * @param    {Object} context
   *           Rendering context passed in by the generator.
   * @return   {Object}
   */
  npm: function(context) {
    var result = {
      scripts: {
        'prebuild': 'npm run clean',
        'build': 'npm-run-all -p build:js build:test',
        'build:js': 'npm-run-all mkdist browserify:js bannerize:js uglify',
        'build:test': 'npm-run-all mkdist browserify:test',
        'clean': 'rm -rf dist && npm run mkdist',
        'mkdist': 'mkdir -p dist',
        'prestart': 'npm-run-all -p docs build',
        'start': 'npm-run-all -p serve watch',
        'serve': 'babel-node scripts/server.js',
        'pretest': 'npm-run-all lint build:test',
        'test': 'karma start test/karma/detected.js',
        'watch': 'npm run mkdist && npm-run-all -p watch:*',
        'watch:js': nameify('watchify src/plugin.js -v -o dist/%s.js', context),
        'watch:test': 'watchify test/plugin.test.js -v -o test/bundle.js',
        'browserify:js': nameify('browserify src/plugin.js -s %s -o dist/%s.js', context),
        'browserify:test': 'browserify test/plugin.test.js -o test/bundle.js',
        'bannerize:js': nameify('bannerize dist/%s.js --banner=scripts/banner.ejs', context),
        'uglify': nameify('uglifyjs dist/%s.js --comments --mangle --compress -o dist/%s.min.js', context)
      },
      devDependencies: {
        'bannerize': '^1.0.0',
        'connect': '^3.4.0',
        'cowsay': '^1.1.0',
        'ejs': '^2.3.4',
        'minimist': '^1.2.0',
        'portscanner': '^1.0.0',
        'serve-static': '^1.10.0',
        'uglify-js': '^2.5.0',
        'watchify': '^3.6.0'
      },
      browserify: {
        transform: [
          'babelify',
          'browserify-shim'
        ]
      }
    };

    // Create scripts for each Karma browser.
    KARMA_BROWSERS.forEach(function(browser) {
      result.scripts['test:' + browser] = [
        'npm run pretest',
        'karma start test/karma/' + browser + '.js'
      ].join(' && ');
    });

    return result;
  },

  /**
   * npm build-specific package.json properties (with Sass support).
   *
   * @function npm+sass
   * @param    {Object} context
   *           Rendering context passed in by the generator.
   *
   * @return   {Object}
   */
  'npm+sass': function(context) {
    return {
      scripts: {
        'build': 'npm-run-all -p build:js build:test build:css',
        'build:css': 'npm-run-all mkdist sass bannerize:css',
        'watch:css': nameify('node-sass --output-style=nested --linefeed=lf src/plugin.scss -o dist -w src && mv dist/plugin.css dist/%s.css', context),
        'bannerize:css': nameify('bannerize dist/%s.css --banner=scripts/banner.ejs', context),
        'sass': nameify('node-sass --output-style=compressed --linefeed=lf src/plugin.scss -o dist && mv dist/plugin.css dist/%s.css', context),
      },
      devDependencies: {
        'node-sass': '^3.4.0'
      }
    };
  }
};

module.exports = function packageJSON() {
  var args = _.toArray(arguments);
  var context = _.isObject(args[0]) ? args.shift() : null;
  var key = args.join('+');
  return PACKAGE[key](context);
};
