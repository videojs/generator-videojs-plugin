'use strict';

var _ = require('lodash');
var util = require('util');

var commands = function commands() {
  return _.toArray(arguments).join(' && ');
};

var PACKAGE = {
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
        'video.js': 'global:videojs'
      },
      standard: {
        ignore: ['dist/']
      },
      scripts: {
        'preversion': 'npm test',
        'version': '',
        'postversion': '',
        'lint': 'standard',
        'pretest': 'npm run lint'
      },
      dependencies: {},
      devDependencies: {
        'babelify': '^6.0.0',
        'browserify': '^11.0.0',
        'browserify-shim': '^3.0.0',
        'globals': '^8.0.0',
        'lodash': '^3.0.0',
        'qunitjs': '^1.0.0',
        'sinon': '^1.0.0',
        'video.js': '^5.0.0',
        'videojs-standard': '^3.7.0'
      }
    };
  },
  grunt: {
    scripts: {
      'build': 'grunt build',
      'build-css': 'grunt build:css',
      'build-js': 'grunt build:js',
      'clean': 'grunt clean:dist',
      'clean-css': 'grunt clean:css',
      'clean-js': 'grunt clean:js',
      'start': 'grunt start',
      'test': 'grunt',
      'watch': 'grunt watch',
      'watch-css': 'grunt watch:css',
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
  },
  'grunt+scss': {
    'grunt-sass': '^1.0.0'
  },
  npm: function (context) {
    return {
      scripts: {
        'build': commands('npm run clean', 'npm run build-js'),
        'build-js': util.format(
          commands(
            'npm run lint',
            'mkdir -p dist',
            'npm run clean-js',
            'browserify src/plugin.js -o dist/%s.js',
            'uglifyjs dist/%s.js --mangle --compress -o dist/%s.min.js'
          ),
          context.packageName,
          context.packageName,
          context.packageName
        ),
        'clean': 'rm -rf dist/*',
        'clean-js': 'rm -f dist/*.js',
        'prestart': 'npm run build',
        'start': 'babel-node scripts/server.js',
        'test': commands('npm run lint'),
        'watch-js': util.format(
          'watchify src/plugin.js -v -o dist/%s.js',
          context.packageName
        )
      },
      devDependencies: {
        'babel': '^5.8.0',
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
  'npm+css': function (context) {
    return {
      scripts: {
        'build': commands('npm run clean', 'npm run build-css', 'npm run build-js'),
        'build-css': commands(
          'mkdir -p dist',
          'npm run clean-css',
          'cp src/plugin.css dist/plugin.css',
          util.format('cssmin dist/plugin.css > dist/%s.css', context.packageName),
          'rm dist/plugin.css'
        ),
        'clean-css': 'rm -f dist/*.css',
        'watch-css': 'watch \'npm run build-css\' src'
      },
      devDependencies: {
        'cssmin': '^0.4.0'
      }
    };
  },
  'npm+scss': {
    scripts: {
      'build': commands('npm run clean', 'npm run build-css', 'npm run build-js'),
      'build-css': commands(
        'mkdir -p dist',
        'npm run clean-css',
        'node-sass --output-style=compressed --linefeed=lf src/plugin.scss -o dist'
      ),
      'clean-css': 'rm -f dist/*.css',
      'watch-css': 'node-sass -w --output-style=compressed --linefeed=lf src/plugin.scss -o dist'
    },
    devDependencies: {
      'node-sass': '^3.4.0'
    }
  }
};

module.exports = function getPkg() {
  var args = _.toArray(arguments);
  var context = _.isObject(args[0]) ? args.shift() : null;
  var key = args.join('+');

  if (_.isFunction(PACKAGE[key])) {
    return PACKAGE[key](context);
  }
  return PACKAGE[key] || {};
};
