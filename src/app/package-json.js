import _ from 'lodash';
import tsmlj from 'tsmlj';

const KARMA_BROWSERS = ['Chrome', 'Firefox', 'IE', 'Safari'];

/**
 * Add/remove a property from an object based on the truthiness of the value.
 *
 * Intended to be invoked with the target object as `this`.
 *
 * @param {Mixed} val
 * @param {String} key
 */
const addRemoveField = function(val, key) {
  if (val) {
    this[key] = val;
  } else {
    delete this[key];
  }
};

/**
 * Updates a package.json object to use videojs-spellbook.
 *
 * @param  {Object} pkg
 * @param  {Object} context
 */
const spellbookify = (pkg, context) => {

  _.each({
    browserify: null
  }, addRemoveField, pkg);

  _.each({
    'babel': null,
    'babelify': null,
    'bannerize': null,
    'bluebird': null,
    'browserify': null,
    'browserify-shim': null,
    'budo': null,
    'mkdirp': null,
    'rimraf': null,
    'uglify-js': null,
    'videojs-languages': null,
    'videojs-spellbook': 'git+ssh://git@github.com:videojs/spellbook.git'
  }, addRemoveField, pkg.devDependencies);

  _.each({
    'build:css': context.sass ? 'cast build-css' : null,
    'build:css:bannerize': null,
    'build:css:sass': null,
    'build:js': 'cast build-js',
    'build:js:babel': null,
    'build:js:bannerize': null,
    'build:js:browserify': null,
    'build:js:uglify': null,
    'build:lang': context.lang ? 'cast build-langs' : null,
    'build:test': 'cast build-tests',
    'clean': 'cast clean',
    'start': 'cast server',
    'test': 'cast test',
    'preversion': 'cast test',
    'version': 'cast version',
    'postversion': 'cast postversion'
  }, addRemoveField, pkg.scripts);

  KARMA_BROWSERS.forEach(browser => {
    browser = browser.toLowerCase();
    pkg.scripts[`test:${browser}`] = `cast test ${browser}`;
  });
};

/**
 * Takes advantage of the way V8 orders object properties - by their
 * assignment order - to "sort" an object in alphabetic order.
 *
 * @param  {Object} source
 * @return {Object}
 *         A new ordered object.
 */
const alphabetizeObject = (source) =>
  _.pick(source, Object.keys(source).sort());

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
const alphabetizeScripts = (source) => {
  let keys = Object.keys(source);
  let prePost = keys.filter(
    k => _.startsWith(k, 'pre') || _.startsWith(k, 'post')
  );
  let order = _.difference(keys, prePost).sort();

  // Inject the pre/post scripts into the order where they belong.
  prePost.forEach(pp => {
    let isPre = _.startsWith(pp, 'pre');
    let i = order.indexOf(pp.substr(isPre ? 3 : 4));

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

/**
 * Create a package.json based on options.
 *
 * @param  {Object} current
 *         Representation of current package.json.
 * @param  {Object} context
 *         Generator rendering context.
 * @return {Object}
 */
const packageJSON = (current, context) => {
  current = current || {};

  /**
   * Replaces all "%s" tokens with the name of the plugin in a given string.
   *
   * @param  {String} str
   * @return {String}
   */
  const nameify = (str) => str.replace(/%s/g, context.pluginName);

  /**
   * Joins and `nameify`s an array of strings.
   *
   * @param  {Array} arr
   * @return {String}
   */
  const scriptify = (arr) => nameify(arr.join(' '));

  const result = _.merge({}, current, {
    'name': context.packageName,
    'version': context.version,
    'description': context.description,
    'main': 'es5/plugin.js',

    'scripts': {
      'prebuild': 'npm run clean',
      'build': 'npm-run-all -p build:*',

      'build:js': scriptify([
        'npm-run-all',
        'build:js:babel',
        'build:js:browserify',
        'build:js:bannerize',
        'build:js:uglify'
      ]),

      'build:js:babel': 'babel src -d es5',

      'build:js:bannerize': scriptify([
        'bannerize dist/%s.js',
        '--banner=scripts/banner.ejs'
      ]),

      'build:js:browserify': scriptify([
        'browserify . -s %s -o dist/%s.js'
      ]),

      'build:js:uglify': scriptify([
        'uglifyjs dist/%s.js',
        '--comments --mangle --compress',
        '-o dist/%s.min.js'
      ]),

      'build:test': 'babel-node scripts/build-test.js',
      'clean': 'rimraf dist test/dist es5 && mkdirp dist test/dist es5',
      'lint': 'vjsstandard',
      'prepublish': 'npm run build',
      'start': 'babel-node scripts/server.js',
      'pretest': 'npm-run-all lint build',
      'test': 'karma start test/karma.conf.js',
      'preversion': 'npm test',
      'version': 'babel-node scripts/version.js',
      'postversion': 'babel-node scripts/postversion.js'
    },

    // Always include the two minimum keywords with whatever exists in the
    // current keywords array.
    'keywords': _.union(['videojs', 'videojs-plugin'], current.keywords),

    'author': context.author,
    'license': context.licenseName,

    'browserify': {
      transform: [
        'browserify-shim',
        'browserify-versionify'
      ]
    },

    'browserify-shim': {
      'qunit': 'global:QUnit',
      'sinon': 'global:sinon',
      'video.js': 'global:videojs'
    },

    // These objects are used as a reference to the browser-global providers.
    'style': nameify('dist/%s.css'),
    'videojs-plugin': {
      style: nameify('dist/%s.css'),
      script: nameify('dist/%s.min.js')
    },

    'vjsstandard': {
      ignore: [
        'dist',
        'docs',
        'es5',
        'test/dist',
        'test/karma.conf.js'
      ]
    },

    'files': [
      'CONTRIBUTING.md',
      'dist/',
      'docs/',
      'es5/',
      'index.html',
      'scripts/',
      'src/',
      'test/'
    ],

    'dependencies': {
      'video.js': '^5.6.0'
    },

    'devDependencies': {

      // Sticking with Babel 5 for now. No significantly compelling reason to upgrade.
      'babel': '^5.8.35',
      'babelify': '^6.4.0',
      'bannerize': '^1.0.2',
      'bluebird': '^3.2.2',

      // browserify-shim wants browserify < 13.
      'browserify': '^12.0.2',
      'browserify-shim': '^3.8.12',
      'browserify-versionify': '^1.0.6',
      'budo': '^8.0.4',
      'glob': '^6.0.3',
      'global': '^4.3.0',
      'karma': '^0.13.19',
      'karma-chrome-launcher': '^0.2.2',
      'karma-detect-browsers': '^2.0.2',
      'karma-firefox-launcher': '^0.1.7',
      'karma-ie-launcher': '^0.2.0',
      'karma-qunit': '^0.1.9',
      'karma-safari-launcher': '^0.1.1',
      'mkdirp': '^0.5.1',
      'npm-run-all': '^1.5.1',
      'qunitjs': '^1.21.0',
      'rimraf': '^2.5.1',
      'sinon': '~1.14.0',
      'uglify-js': '^2.6.1',
      'videojs-standard': '^4.0.0'
    }
  });

  // Create scripts for each Karma browser.
  KARMA_BROWSERS.forEach(browser => {
    result.scripts[`test:${browser.toLowerCase()}`] = tsmlj`
      npm run pretest &&
      karma start test/karma.conf.js --browsers ${browser}
    `;
  });

  if (context.changelog) {
    result.devDependencies.chg = '^0.3.2';
    result.scripts.change = 'chg add';
  }

  // Support the Sass option.
  if (context.sass) {
    _.assign(result.scripts, {
      'build:css': 'npm-run-all build:css:sass build:css:bannerize',

      'build:css:bannerize': scriptify([
        'bannerize dist/%s.css --banner=scripts/banner.ejs'
      ]),

      'build:css:sass': scriptify([
        'node-sass',
        'src/plugin.scss',
        'dist/%s.css',
        '--output-style=compressed',
        '--linefeed=lf'
      ])
    });

    result.devDependencies['node-sass'] = '^3.4.2';
  }

  // Support the documentation tooling option.
  if (context.docs) {

    _.assign(result.scripts, {
      'docs': 'npm-run-all docs:*',
      'docs:api': 'jsdoc src -r -d docs/api',
      'docs:toc': 'doctoc README.md'
    });

    _.assign(result.devDependencies, {
      doctoc: '^0.15.0',
      jsdoc: '^3.4.0'
    });
  }

  // Include language support. Note that `mkdirs` does not need to change
  // here because the videojs-languages package will create the destination
  // directory if needed.
  if (context.lang) {
    result.scripts['build:lang'] = 'vjslang --dir dist/lang';
    result.devDependencies['videojs-languages'] = '^1.0.0';
  }

  // Support Bower.
  if (context.bower) {
    result.files.push('bower.json');
  }

  if (context.ghooks) {
    result.devDependencies.ghooks = '^1.1.1';
    result.config = {
      ghooks: {
        'pre-push': 'npm test'
      }
    };
  }

  // Support the spellbook flag.
  if (context.spellbook) {
    spellbookify(result, context);
  }

  // Sort arrays and objects.
  result.files.sort();
  result.keywords.sort();
  result.vjsstandard.ignore.sort();
  result.scripts = alphabetizeScripts(result.scripts);
  result.dependencies = alphabetizeObject(result.dependencies);
  result.devDependencies = alphabetizeObject(result.devDependencies);

  return result;
};

export default packageJSON;
