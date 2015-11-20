'use strict';

var _ = require('lodash');
var util = require('util');


/**
 * Convert an array of npm scripts into an object where the keys are the
 * array elements and the values are the equivalent Grunt script values.
 *
 * @example
 *   gruntify(['a', 'b']) === {a: "grunt a", b: "grunt b"}
 * @private
 * @param  {String} string
 * @param  {Object} context
 * @return {String}
 */
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
 * @private
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
      main: 'es5/plugin.js',
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
          'dist',
          'docs',
          'es5'
        ]
      },
      scripts: {
        'docs': 'npm-run-all -p docs:toc docs:api',
        'docs:api': 'documentation src/*.js -f html -o docs/api',
        'docs:toc': 'doctoc README.md',
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
        'doctoc': '^0.15.0',
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
        'npm-run-all': '~1.2.0',
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
        'grunt-babel': '^5.0.0',
        'grunt-browserify': '^4.0.0',
        'grunt-concurrent': '^2.0.0',
        'grunt-contrib-clean': '^0.6.0',
        'grunt-contrib-connect': '^0.11.0',
        'grunt-contrib-uglify': '^0.9.0',
        'grunt-karma': '^0.12.0',
        'grunt-run': '^0.5.0',
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
      browserify: {
        transform: ['browserify-shim']
      },

      scripts: {
        'prebuild': 'npm run clean',
        'build': 'npm-run-all -p build:*',
        'build:js': 'npm-run-all mkdirs build:js:babel build:js:browserify build:js:bannerize build:js:uglify',
        'build:js:babel': 'babel src -d es5',
        'build:js:bannerize': nameify('bannerize dist/%s.js --banner=scripts/banner.ejs', context),
        'build:js:browserify': nameify('browserify . -s %s -o dist/%s.js', context),
        'build:js:uglify': nameify('uglifyjs dist/%s.js --comments --mangle --compress -o dist/%s.min.js', context),
        'build:test': 'npm-run-all mkdirs build:test:browserify',
        'build:test:browserify': 'browserify test/plugin.test.js -t babelify -o test/bundle.js',
        'clean': 'rm -rf dist es5',
        'mkdirs': 'mkdir -p dist es5',
        'serve': 'babel-node scripts/server.js',
        'prestart': 'npm-run-all -p docs build',
        'start': 'npm-run-all -p serve watch',
        'pretest': 'npm-run-all lint build:test',
        'test': 'karma start test/karma/detected.js',
        'watch': 'npm run mkdirs && npm-run-all -p watch:*',
        'watch:js': nameify('watchify src/plugin.js -t babelify -v -o dist/%s.js', context),
        'watch:test': 'watchify test/plugin.test.js -t babelify -v -o test/bundle.js',
      },

      devDependencies: {
        'bannerize': '^1.0.0',
        'connect': '^3.4.0',
        'cowsay': '^1.1.0',
        'minimist': '^1.2.0',
        'portscanner': '^1.0.0',
        'serve-static': '^1.10.0',
        'uglify-js': '^2.5.0',
        'watchify': '^3.6.0'
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
        'build:css': 'npm-run-all mkdirs build:css:sass build:css:bannerize',
        'build:css:bannerize': nameify('bannerize dist/%s.css --banner=scripts/banner.ejs', context),
        'build:css:sass': nameify('node-sass --output-style=compressed --linefeed=lf src/plugin.scss -o dist && mv dist/plugin.css dist/%s.css', context),
        'watch:css': nameify('node-sass --output-style=nested --linefeed=lf src/plugin.scss -o dist -w src && mv dist/plugin.css dist/%s.css', context),
      },
      devDependencies: {
        'node-sass': '^3.4.0'
      }
    };
  }
};

module.exports = function packageJSON(context, builder, sass) {
  return _.merge(
    {},
    PACKAGE.common(context),
    PACKAGE[builder](context),
    sass ? PACKAGE[builder + '+sass'](context) : null
  );
};
