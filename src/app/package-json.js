import _ from 'lodash';
import generatorVersion from './generator-version';

const DEFAULTS = {
  dependencies: {},
  devDependencies: {
    'videojs-spellbook': '^2.0.0',
    'ghooks': '^1.3.2'
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
  const keys = Object.keys(source);
  const prePost = keys.filter(
    k => _.startsWith(k, 'pre') || _.startsWith(k, 'post')
  );
  const order = _.difference(keys, prePost).sort();

  // Inject the pre/post scripts into the order where they belong.
  prePost.forEach(pp => {
    const isPre = _.startsWith(pp, 'pre');
    const i = order.indexOf(pp.substr(isPre ? 3 : 4));

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

  const result = _.assign({}, current, {
    'name': context.packageName,
    'version': context.version,
    'description': context.description,
    'main': 'dist/es5/index.js',
    'jsnext:main': 'src/js/index.js',

    'generator-videojs-plugin': {
      version: generatorVersion()
    },

    'scripts': _.assign({}, current.scripts, {
      clean: 'sb-clean',
      build: 'sb-build',
      lint: 'sb-lint',
      prepublish: 'npm run build',
      start: 'sb-start',
      watch: 'sb-watch',
      test: 'sb-test',
      release: 'sb-release',
      version: 'sb-release'
    }),

    // Always include the two minimum keywords with whatever exists in the
    // current keywords array.
    'keywords': _.union(['videojs', 'videojs-plugin'], current.keywords).sort(),
    'author': context.author,
    'license': context.licenseName,

    'browserify-shim': 'node_modules/videojs-spellbook/config/shim.config.js',
    'spellbook': {},

    'files': [
      'CONTRIBUTING.md',
      'CHANGELOG.md',
      'README.md',
      'dist/',
      'index.html',
      'src/'
    ],

    'dependencies': _.assign({}, current.dependencies, DEFAULTS.dependencies),

    'devDependencies': _.assign(
      {},
      current.devDependencies,
      DEFAULTS.devDependencies
    )
  });

  // spellbook mappings
  ['js', 'css', 'lang', 'docs'].forEach(function(prop) {
    if (context[prop] === false) {
      result.spellbook[prop] = false;
    }
  });

  // support ie8
  if (context.ie8 === true) {
    result.spellbook.ie8 = true;
  }

  // In case ghooks was previously installed, but is now "none", we can
  // remove it from the package.json entirely.
  if (context.ghooks === 'none') {
    delete result.devDependencies.ghooks;

    if (result.config) {
      delete result.config.ghooks;
    }
  } else {
    result.devDependencies.ghooks = '^1.3.2';
    result.config = {
      ghooks: {
        'pre-push': `npm run ${context.ghooks}`
      }
    };
  }

  result.files.sort();
  result.scripts = alphabetizeScripts(result.scripts);
  result.dependencies = alphabetizeObject(result.dependencies);
  result.devDependencies = alphabetizeObject(result.devDependencies);

  return result;
};

export default packageJSON;
