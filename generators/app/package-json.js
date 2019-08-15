'use strict';

const _ = require('lodash');
const generatorVersion = require('./generator-version');
const pkgTemplate = require('../../plugin/package.json');

/**
 * Takes advantage of the way V8 orders object properties - by their
 * assignment order - to "sort" an object in alphabetic order.
 *
 * @param  {Object} source
 *         A plain object to be sorted.
 *
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
 *         A plain object to be sorted.
 *
 * @return {Object}
 *         A new ordered object.
 */
const alphabetizeScripts = (source) => {
  const keys = Object.keys(source);
  const prePost = keys.filter(k => _.startsWith(k, 'pre') || _.startsWith(k, 'post'));
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
 *
 * @param  {Object} context
 *         Generator rendering context.
 *
 * @return {Object}
 *         A new representation package.json.
 */
const packageJSON = (current, context) => {
  current = current || {};

  // Replaces all "%s" tokens with the name of the plugin in a given string.
  const scriptify = (str) => {
    str = Array.isArray(str) ? str.join(' ') : str;
    return str.replace(/%s/g, context.pluginName);
  };

  const result = _.assign({}, current, pkgTemplate, {
    'name': context.packageName,
    'version': context.version,
    'description': context.description,
    'main': scriptify(pkgTemplate.main),
    'module': scriptify(pkgTemplate.module),
    'author': context.author,
    'license': context.licenseName,

    'generator-videojs-plugin': {
      version: generatorVersion()
    },
    'scripts': _.assign({}, current.scripts, pkgTemplate.scripts, {
      'build:css': scriptify(pkgTemplate.scripts['build:css'])
    }),

    'vjsstandard': _.assign({}, current.vjsstandard, pkgTemplate.vjsstandard, {
      ignore: _.union(current.vjsstandard && current.vjsstandard.ignore, pkgTemplate.vjsstandard.ignore).sort()
    }),

    'husky': {
      hooks: _.assign({}, current.husky && current.husky.hooks || {}, pkgTemplate.husky.hooks)
    },

    'lint-staged': _.assign({}, current['lint-staged'], pkgTemplate['lint-staged']),

    // Always include the two minimum keywords with whatever exists in the
    // current keywords array.
    'keywords': _.union(pkgTemplate.keywords, current.keywords).sort(),
    'dependencies': _.assign({}, current.dependencies, pkgTemplate.dependencies),
    'devDependencies': _.assign({}, current.devDependencies, pkgTemplate.devDependencies)
  });

  // In case husky was previously installed, but is now "none", we can
  // remove it from the package.json entirely.
  if (!context.precommit) {
    delete result.scripts.precommit;
    delete result.husky.hooks['pre-commit'];
    delete result['lint-staged'];
  }

  if (!context.prepush) {
    delete result.scripts.prepush;
    delete result.husky.hooks['pre-push'];
  }

  if (!context.prepush && !context.precommit) {
    delete result.devDependencies.husky;
    delete result.devDependencies['lint-staged'];
  }

  // Support the documentation tooling option.
  if (!context.docs) {
    delete result.scripts.docs;
    delete result.scripts['docs:api'];
    delete result.scripts['docs:toc'];
    delete result.devDependencies.jsdoc;
    if (result['lint-staged']) {
      delete result['lint-staged']['README.md'];
    }
  }

  if (!context.css) {
    delete result.scripts['build:css'];
    delete result.scripts['watch:css'];
    delete result.devDependencies['postcss-cli'];
    delete result.devDependencies['videojs-generate-postcss-config'];
  }

  // Include language support. Note that `mkdirs` does not need to change
  // here because the videojs-languages package will create the destination
  // directory if needed.
  if (!context.lang) {
    delete result.scripts['build:lang'];
    delete result.devDependencies['videojs-languages'];
  }

  result.files.sort();
  result.scripts = alphabetizeScripts(result.scripts);
  result.dependencies = alphabetizeObject(result.dependencies);
  result.devDependencies = alphabetizeObject(result.devDependencies);

  return result;
};

module.exports = packageJSON;
