'use strict';

var _ = require('lodash');
var util = require('util');

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



/**
 * Takes advantage of the way V8 orders object properties - by their
 * assignment order - to "sort" an object in alphabetic order.
 *
 * @param  {Object} source
 * @return {Object}
 *         A new ordered object.
 */
var alphabetizeObject = function(source) {
  return _.pick(source, Object.keys(source).sort());
};

/**
 * Identical to `alphabetizeObject`, but there is special handling to
 * preserve the ordering of "pre" and "post" scripts next to their
 * core scripts. For example:
 *
 *    "preversion": "...",
 *    "version": "...",
 *    "postversion": "..."
 *
 * @param  {Object} source
 * @return {Object}
 *         A new ordered object.
 */
var alphabetizeScripts = function(source) {
  var keys = Object.keys(source);

  var prePost = keys.filter(function(k) {
    return _.startsWith(k, 'pre') || _.startsWith(k, 'post');
  });

  var order = _.difference(keys, prePost).sort();
  var result = {};

  // Inject the pre/post scripts into the order where they belong.
  prePost.forEach(function(pp) {
    var isPre = _.startsWith(pp, 'pre');
    var core = pp.substr(isPre ? 3 : 4);
    var i = order.indexOf(core);

    // Insert pre-scripts in place of their related core script and
    // post-scripts after their related core script.
    if (i > -1) {
      order.splice(isPre ? i : i + 1, 0, pp);

    // If this is a pre/post script with no related core script, just
    // stick it on the end. This is an unlikely case, though.
    } else {
      order.push(pp);
    }
  });

  return _.pick(source, order);
};


var KARMA_BROWSERS = ['chrome', 'firefox', 'ie', 'opera', 'safari'];

/**
 * Create a package.json based on options.
 *
 * @param  {Object} current
 *         Representation of current package.json.
 * @param  {Object} context
 *         Generator rendering context.
 * @return {Object}
 */
module.exports = function(current, context) {
  current = current || {};

  var result = {
    name: context.packageName,
    author: context.author,
    license: context.licenseName,
    version: context.version,
    main: 'es5/plugin.js',
    keywords: [
      'videojs',
      'videojs-plugin'
    ],
    browserify: {
      transform: ['browserify-shim']
    },
    'browserify-shim': {
      'qunit': 'global:QUnit',
      'sinon': 'global:sinon',
      'video.js': 'global:videojs'
    },
    standard: {
      ignore: [
        'dist',
        'docs',
        'es5',
        'test/karma'
      ]
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
      'lint': 'standard',
      'mkdirs': 'mkdir -p dist es5',
      'prestart': 'npm-run-all build',
      'start': 'npm-run-all -p start:serve watch',
      'start:serve': 'babel-node scripts/server.js',
      'pretest': 'npm-run-all lint build:test',
      'test': 'karma start test/karma/detected.js',
      'preversion': './scripts/npm-preversion.sh',
      'version': './scripts/npm-version.sh',
      'postversion': './scripts/npm-postversion.sh',
      'watch': 'npm run mkdirs && npm-run-all -p watch:*',
      'watch:js': nameify('watchify src/plugin.js -t babelify -v -o dist/%s.js', context),
      'watch:test': 'watchify test/plugin.test.js -t babelify -v -o test/bundle.js'
    },
    devDependencies: {
      'babel': '^5.8.0',
      'babelify': '^6.0.0',
      'bannerize': '^1.0.0',
      'browserify': '^11.0.0',
      'browserify-shim': '^3.0.0',
      'connect': '^3.4.0',
      'cowsay': '^1.1.0',
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
      'minimist': '^1.2.0',
      'npm-run-all': '~1.2.0',
      'portscanner': '^1.0.0',
      'qunitjs': '^1.0.0',
      'serve-static': '^1.10.0',
      'sinon': '^1.0.0',
      'uglify-js': '^2.5.0',
      'video.js': '^5.0.0',
      'videojs-standard': '^3.7.0',
      'watchify': '^3.6.0'
    }
  };

  if (context.isPrivate) {
    result.private = true;
  }

  // Create scripts for each Karma browser.
  KARMA_BROWSERS.forEach(function(browser) {
    result.scripts['test:' + browser] = [
      'npm run pretest',
      'karma start test/karma/' + browser + '.js'
    ].join(' && ');
  });

  // Both "scripts" and "devDependencies" get merged with the current
  // package.json values, but the properties coming from the generator
  // take precedence because it should be the single source of truth.
  result.scripts = _.assign({}, current.scripts, result.scripts);
  result.devDependencies = _.assign({}, current.devDependencies, result.devDependencies);

  // Support the Sass option.
  if (context.sass) {
    result.scripts = _.assign(result.scripts, {
      'build:css': 'npm-run-all mkdirs build:css:sass build:css:bannerize',
      'build:css:bannerize': nameify('bannerize dist/%s.css --banner=scripts/banner.ejs', context),
      'build:css:sass': nameify('node-sass --output-style=compressed --linefeed=lf src/plugin.scss -o dist && mv dist/plugin.css dist/%s.css', context),
      'watch:css': nameify('node-sass --output-style=nested --linefeed=lf src/plugin.scss -o dist -w src && mv dist/plugin.css dist/%s.css', context),
    });

    result.devDependencies = _.assign(result.devDependencies, {
      'node-sass': '^3.4.0'
    });
  }

  // Support the documentation tooling option.
  if (context.docs) {
    result.scripts = _.assign(result.scripts, {
      'docs': 'npm-run-all -p docs:toc docs:api',
      'docs:api': 'documentation src/*.js -f html -o docs/api',
      'docs:toc': 'doctoc README.md',
      'prestart': 'npm-run-all -p docs build'
    });

    result.devDependencies = _.assign(result.devDependencies, {
      'doctoc': '^0.15.0',
      'documentation': '^3.0.0'
    });
  }

  result.scripts = alphabetizeScripts(result.scripts);
  result.devDependencies = alphabetizeObject(result.devDependencies);

  return result;
};
