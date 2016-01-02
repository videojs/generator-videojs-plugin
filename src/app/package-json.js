import _ from 'lodash';
import util from 'util';

const KARMA_BROWSERS = ['chrome', 'firefox', 'ie', 'safari'];

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
   * Replaces all "%s" tokens with the name of the package in a given string.
   *
   * @param  {String} str
   * @return {String}
   */
  let scriptify = (str) => {
    str = Array.isArray(str) ? str.join(' ') : str;

    let tokens = str.match(/%s/g) || [];

    return util.format(...[str].concat(tokens.map(() => context.nameOf.package)));
  };

  let result = _.assign({}, current, {
    'name': context.nameOf.package,
    'version': context.version,
    'description': context.description,
    'main': 'es5/plugin.js',

    'scripts': _.assign({}, current.scripts, {
      'prebuild': 'npm run clean',
      'build': 'npm-run-all -p build:*',

      'build:js': scriptify([
        'npm-run-all',
        'mkdirs',
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

      'build:test': 'npm-run-all mkdirs build:test:browserify',
      'build:test:browserify': 'node scripts/build-test-browserify.js',
      'clean': 'node -e "require(\'shelljs\').rm(\'-rf\',[\'dist\',\'dist-test\',\'es5\'])"',
      'lint': 'vjsstandard',
      'mkdirs': 'node -e "require(\'shelljs\').mkdir(\'-p\',[\'dist\',\'dist-test\',\'es5\'])"',
      'prepublish': 'npm run build',
      'prestart': 'npm run build',
      'start': 'npm-run-all -p start:serve watch',
      'start:serve': 'babel-node scripts/server.js',
      'pretest': 'npm-run-all lint build:test',
      'test': 'karma start test/karma/detected.js',
      'preversion': 'npm test',
      'version': 'npm run build',
      'postversion': 'git push origin master && git push origin --tags',
      'watch': 'npm run mkdirs && npm-run-all -p watch:*',

      'watch:js': scriptify([
        'watchify src/plugin.js',
        '-t babelify',
        '-v -o dist/%s.js'
      ]),

      'watch:test': scriptify([

        // Uses `find` because Browserify does not support globstar
        // (e.g. **/*.test.js) patterns via CLI.
        'watchify `find test -name \'*.test.js\'`',
        '-t babelify',
        '-o dist-test/%s.js'
      ])
    }),

    // Always include the two minimum keywords with whatever exists in the
    // current keywords array.
    'keywords': _.union(['videojs', 'videojs-plugin'], current.keywords).sort(),

    'author': context.author,
    'license': context.nameOf.license,

    'browserify': {
      transform: ['browserify-shim']
    },

    'browserify-shim': {
      'qunit': 'global:QUnit',
      'sinon': 'global:sinon',
      'video.js': 'global:videojs'
    },

    'vjsstandard': {
      ignore: [
        'dist',
        'dist-test',
        'docs',
        'es5',
        'test/karma',

        // Scripts is ignored for now because videojs-standard does not
        // make accomodations for things that are safe in Node.
        'scripts'
      ]
    },

    'files': [
      'dist/',
      'dist-test/',
      'docs/',
      'es5/',
      'scripts/',
      'src/',
      'test/',
      'index.html'
    ],

    'dependencies': _.assign({}, current.dependencies, {
      'video.js': '^5.0.0'
    }),

    'devDependencies': _.assign({}, current.devDependencies, {
      'babel': '^5.8.0',
      'babelify': '^6.0.0',
      'bannerize': '^1.0.0',
      'browserify': '^11.0.0',
      'browserify-shim': '^3.0.0',
      'connect': '^3.4.0',
      'cowsay': '^1.1.0',
      'glob': '^6.0.3',
      'global': '^4.3.0',
      'karma': '^0.13.0',
      'karma-browserify': '^4.4.0',
      'karma-chrome-launcher': '^0.2.0',
      'karma-detect-browsers': '^2.0.0',
      'karma-firefox-launcher': '^0.1.0',
      'karma-ie-launcher': '^0.2.0',
      'karma-qunit': '^0.1.0',
      'karma-safari-launcher': '^0.1.0',
      'lodash-compat': '^3.10.0',
      'minimist': '^1.2.0',
      'npm-run-all': '~1.2.0',
      'portscanner': '^1.0.0',
      'qunitjs': '^1.0.0',
      'serve-static': '^1.10.0',
      'shelljs': '^0.5.3',
      'sinon': '^1.0.0',
      'uglify-js': '^2.5.0',
      'videojs-standard': '^4.0.0',
      'watchify': '^3.6.0'
    })
  });

  if (context.isPrivate) {
    result.private = true;
  } else {
    result.files.push('CONTRIBUTING.md');
  }

  // Create scripts for each Karma browser.
  KARMA_BROWSERS.forEach(function(browser) {
    result.scripts['test:' + browser] = [
      'npm run pretest',
      'karma start test/karma/' + browser + '.js'
    ].join(' && ');
  });

  // Support the Sass option.
  if (context.sass) {
    _.assign(result.scripts, {
      'build:css': 'npm-run-all mkdirs build:css:sass build:css:bannerize',

      'build:css:bannerize': scriptify([
        'bannerize dist/%s.css --banner=scripts/banner.ejs'
      ]),

      'build:css:sass': scriptify([
        'node-sass',
        '--output-style=compressed',
        '--linefeed=lf',
        'src/plugin.scss -o dist && ',
        'node -e "require(\'shelljs\').mv(\'dist/plugin.css\',\'dist/%s.css\')"'
      ]),

      'watch:css': scriptify([
        'node-sass',
        '--output-style=nested',
        '--linefeed=lf',
        'src/plugin.scss -o dist -w src &&',
        'node -e "require(\'shelljs\').mv(\'dist/plugin.css\',\'dist/%s.css\')"'
      ])
    });

    _.assign(result.devDependencies, {
      'node-sass': '^3.4.0'
    });
  }

  // Support the documentation tooling option.
  if (context.docs) {

    _.assign(result.scripts, {
      'docs': 'npm-run-all -p docs:*',
      'docs:api': 'documentation src/*.js -f html -o docs/api',
      'docs:toc': 'doctoc README.md',
      'prestart': 'npm-run-all -p docs build'
    });

    _.assign(result.devDependencies, {
      doctoc: '^0.15.0',
      documentation: '^3.0.0'
    });
  }

  // Include language support. Note that `mkdirs` does not need to change
  // here because the videojs-languages package will create the destination
  // directory if needed.
  if (context.lang) {
    _.assign(result.scripts, {
      'build:lang': 'vjslang --dir dist/lang'
    });

    _.assign(result.devDependencies, {
      'videojs-languages': '^1.0.0'
    });
  }

  if (context.bower) {
    result.files.push('bower.json');

    _.assign(result.scripts, {
      preversion: './scripts/npm-preversion-for-bower.sh',
      version: './scripts/npm-version-for-bower.sh',
      postversion: './scripts/npm-postversion-for-bower.sh'
    });
  }

  result.files.sort();
  result.scripts = alphabetizeScripts(result.scripts);
  result.dependencies = alphabetizeObject(result.dependencies);
  result.devDependencies = alphabetizeObject(result.devDependencies);

  return result;
};

export default packageJSON;
