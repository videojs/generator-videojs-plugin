'use strict';

var _ = require('lodash');
var util = require('util');

var commands = function commands() {
  return _.toArray(arguments).join(' && ');
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
  common: function (context) {
    return {
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
        'lodash': 'global:_',
        'qunit': 'global:QUnit',
        'sinon': 'global:sinon',
        'video.js': 'global:videojs'
      },
      standard: {
        ignore: [
          '**/dist/'
        ]
      },
      scripts: {
        'clean': 'npm run clean-dist',
        'lint': 'standard',
        'mkdirs': 'mkdir -p dist test/unit/dist',
        'postversion': '',
        'pretest': 'npm run lint',
        'preversion': 'npm test',
        'version': ''
      },
      dependencies: {},
      devDependencies: {
        'babel': '^5.8.0',
        'babelify': '^6.0.0',
        'browserify': '^11.0.0',
        'browserify-shim': '^3.0.0',
        'global': '^4.3.0',
        'lodash': '^3.0.0',
        'qunitjs': '^1.0.0',
        'sinon': '^1.0.0',
        'video.js': '^5.0.0',
        'videojs-standard': '^3.7.0'
      }
    };
  },

  /**
   * Grunt build-specific package.json properties.
   *
   * @function grunt
   * @param    {Object} context
   *           Rendering context passed in by the generator.
   * @return   {Object}
   */
  grunt: function () {
    return {
      scripts: {
        'build': 'grunt build',
        'build-js': 'grunt build:js',
        'clean-dist': 'grunt clean:dist',
        'clean-js': 'grunt clean:js',
        'start': 'grunt start',
        'test': 'grunt test',
        'watch': 'grunt watch',
        'watch-js': 'grunt watch:js'
      },
      devDependencies: {
        'grunt-banner': '^0.6.0',
        'grunt-browserify': '^4.0.1',
        'grunt-concurrent': '^2.0.3',
        'grunt-contrib-clean': '^0.6.0',
        'grunt-contrib-connect': '^0.11.2',
        'grunt-contrib-qunit': '^0.7.0',
        'grunt-contrib-uglify': '^0.9.2',
        'grunt-contrib-watch': '^0.6.1',
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
  'grunt+sass': function () {
    return {
      scripts: {
        'build-css': 'grunt build:css',
        'clean-css': 'grunt clean:css',
        'watch-css': 'grunt watch:css',
      },
      devDependencies: {
        'grunt-sass': '^1.0.0'
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
  npm: function (context) {
    var browserifyTest = util.format(
      'browserify test/unit/plugin.test.js -o test/unit/dist/%s.js',
      context.packageName
    );

    return {
      scripts: {
        'build': commands(
          'npm run clean-dist',
          'npm run mkdirs',
          'npm run build-js'
        ),
        'build-js': commands(
          'npm run lint',
          'npm run clean-js',
          'npm run mkdirs',
          util.format(
            'browserify src/plugin.js -s %s -o dist/%s.js',
            context.packageName,
            context.packageName
          ),
          browserifyTest,
          util.format(
            'uglifyjs dist/%s.js --mangle --compress -o dist/%s.min.js',
            context.packageName,
            context.packageName
          )
        ),
        'clean-dist': 'rm -rf dist',
        'clean-js': 'rm -f dist/*.js',
        'prestart': 'npm run build',
        'start': 'babel-node scripts/server.js',
        'test': commands(
          'npm run lint',
          browserifyTest
        ),
        'watch-js': util.format(
          'watchify src/plugin.js -v -o dist/%s.js',
          context.packageName
        )
      },
      devDependencies: {
        'connect': '^3.4.0',
        'portscanner': '^1.0.0',
        'serve-static': '^1.10.0',
        'uglify-js': '^2.5.0',
        'watch': '^0.16.0'
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
  'npm+sass': function (context) {
    var nodeSass = util.format(
      'node-sass --output-style=compressed --linefeed=lf src/plugin.scss -o dist && mv dist/plugin.css dist/%s.css',
      context.packageName
    );

    return {
      scripts: {
        'build': commands(
          'npm run clean-dist',
          'npm run mkdirs',
          'npm run build-css',
          'npm run build-js'
        ),
        'build-css': commands(
          'npm run clean-css',
          'npm run mkdirs',
          nodeSass
        ),
        'clean-css': 'rm -f dist/*.css',
        'watch-css': nodeSass
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

  if (_.isFunction(PACKAGE[key])) {
    return PACKAGE[key](context);
  }
  return PACKAGE[key] || {};
};
