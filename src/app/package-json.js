import _ from 'lodash';
import tsmlj from 'tsmlj';

const KARMA_BROWSERS = ['Chrome', 'Firefox', 'IE', 'Safari'];

const DEFAULTS = {
  dependencies: {
    'video.js': '^5.6.0'
  },
  devDependencies: {
    'babel': '^5.8.0',
    'babelify': '^6.0.0',
    'bannerize': '^1.0.0',
    'browserify': '^13.0.0',
    'browserify-shim': '^3.0.0',
    'budo': '^8.0.0',
    'chg': '^0.3.2',
    'glob': '^6.0.3',
    'global': '^4.3.0',
    'karma': '^0.13.0',
    'karma-chrome-launcher': '^0.2.0',
    'karma-detect-browsers': '^2.0.0',
    'karma-firefox-launcher': '^0.1.0',
    'karma-ie-launcher': '^0.2.0',
    'karma-qunit': '^0.1.0',
    'karma-safari-launcher': '^0.1.0',
    'mkdirp': '^0.5.1',
    'npm-run-all': '^1.2.0',
    'qunitjs': '^1.0.0',
    'rimraf': '^2.5.1',
    'sinon': '^1.0.0',
    'uglify-js': '^2.5.0',
    'videojs-standard': '^4.0.0'
  }
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
  let scriptify = (str) => {
    str = Array.isArray(str) ? str.join(' ') : str;
    return str.replace(/%s/g, context.pluginName);
  };

  let result = _.assign({}, current, {
    'name': context.packageName,
    'version': context.version,
    'description': context.description,
    'main': 'es5/plugin.js',

    'scripts': _.assign({}, current.scripts, {
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

      'build:test': 'node scripts/build-test.js',
      'clean': 'rimraf dist test/dist es5 && mkdirp dist test/dist es5',
      'lint': 'vjsstandard',
      'prepublish': 'npm run build',
      'start': 'node scripts/server.js',
      'pretest': 'npm-run-all lint build',
      'test': 'karma start test/karma.conf.js',
      'preversion': 'npm test',
      'version': 'node scripts/version.js',
      'postversion': 'node scripts/postversion.js'
    }),

    // Always include the two minimum keywords with whatever exists in the
    // current keywords array.
    'keywords': _.union(['videojs', 'videojs-plugin'], current.keywords).sort(),

    'author': context.author,
    'license': context.licenseName,

    'browserify': {
      transform: ['browserify-shim']
    },

    'browserify-shim': {
      'qunit': 'global:QUnit',
      'sinon': 'global:sinon',
      'video.js': 'global:videojs'
    },

    // These objects are used as a reference to the browser-global providers.
    'style': scriptify('dist/%s.css'),
    'videojs-plugin': {
      style: scriptify('dist/%s.css'),
      script: scriptify('dist/%s.min.js')
    },

    'vjsstandard': {
      ignore: [
        'dist',
        'docs',
        'es5',
        'test/dist',
        'test/karma.conf.js',
        'scripts'
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

    'dependencies': _.assign({}, current.dependencies, DEFAULTS.dependencies),

    'devDependencies': _.assign(
      {},
      current.devDependencies,
      DEFAULTS.devDependencies
    )
  });

  // Create scripts for each Karma browser.
  KARMA_BROWSERS.forEach(browser => {
    result.scripts[`test:${browser.toLowerCase()}`] = tsmlj`
      npm run pretest &&
      karma start test/karma.conf.js --browsers ${browser}
    `;
  });

  if (context.changelog) {
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

    result.devDependencies['node-sass'] = '^3.4.0';
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

  if (context.bower) {
    result.files.push('bower.json');
  }

  result.files.sort();
  result.scripts = alphabetizeScripts(result.scripts);
  result.dependencies = alphabetizeObject(result.dependencies);
  result.devDependencies = alphabetizeObject(result.devDependencies);

  return result;
};

export default packageJSON;
