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
        'build': '',
        'build:css': '',
        'build:js': '',
        'build:test': '',
        'clean': '',
        'docs': 'documentation src/*.js -f html -o docs/api',
        'lint': 'standard',
        'start': '',
        'test': '',
        'preversion': './scripts/npm-preversion.sh',
        'version': './scripts/npm-version.sh',
        'postversion': './scripts/npm-postversion.sh',
        'watch': '',
        'watch:css': '',
        'watch:js': '',
        'watch:test': ''
      },
      dependencies: {},
      devDependencies: {
        'babel': '^5.8.0',
        'babelify': '^6.0.0',
        'browserify': '^11.0.0',
        'browserify-shim': '^3.0.0',
        'documentation': '^3.0.0',
        'global': '^4.3.0',
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
    return {
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
        'grunt-run': '^0.5.2',
        'load-grunt-tasks': '^3.1.0'
      }
    };
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
    return {
      scripts: {
        'prebuild': 'npm run clean',
        'build': 'npm-run-all -p build:js build:test',
        'build:js': 'npm-run-all browserify:js bannerize:js uglify',
        'build:test': nameify('browserify test/unit/plugin.test.js -o test/unit/dist/%s.js', context),
        'clean': 'rm -rf dist test/unit/dist && mkdir -p dist test/unit/dist',
        'prestart': 'npm-run-all -p docs build',
        'start': 'npm-run-all -p serve watch',
        'serve': 'babel-node scripts/server.js',
        'pretest': 'npm-run-all lint build:test',
        'test': '', // TODO Karma
        'watch': 'npm-run-all -p watch:js watch:test',
        'watch:js': nameify('watchify src/plugin.js -v -o dist/%s.js', context),
        'watch:test': nameify('watchify test/unit/plugin.test.js -v -o test/unit/dist/%s.js', context),
        'browserify:js': nameify('browserify src/plugin.js -s %s -o dist/%s.js', context),
        'bannerize:js': nameify('babel-node scripts/bannerize.js dist/%s.js', context),
        'uglify': nameify('uglifyjs dist/%s.js --comments --mangle --compress -o dist/%s.min.js', context)
      },
      devDependencies: {
        'connect': '^3.4.0',
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
        'build:css': 'npm-run-all sass bannerize:css',
        'watch': 'npm-run-all -p watch:css watch:js watch:test',
        'watch:css': nameify('node-sass --output-style=nested --linefeed=lf src/plugin.scss -o dist -w src && mv dist/plugin.css dist/%s.css', context),
        'bannerize:css': nameify('babel-node scripts/bannerize.js dist/%s.css', context),
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
