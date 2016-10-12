import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import {assert} from 'yeoman-generator';

// Files that are expected to exist in certain conditions.
const FILES = {

  // files that are deployed by default
  default: [
    '.git',
    '.editorconfig',
    '.gitignore',
    '.npmignore',
    'README.md',
    'CHANGELOG.md',
    'CONTRIBUTING.md',
    'src/js/index.js',
    'src/test/index.test.js',
    'index.html',
    'package.json',
    'bower.json'
  ],

  // only deployed when css = yes
  css: [
    'src/css/index.scss'
  ],

  // only deployed when docs = yes
  docs: [
    'src/docs/index.md'
  ],

  // only ommitted when bower = no
  bower: [
    'bower.json'
  ],

  // only deployed when i18n = yes
  i18n: [
    'src/i18n/en.json'
  ],

  // files that only get deployed when the licence is not private
  oss: [
    '.travis.yml',
    'LICENSE',
    '.github/ISSUE_TEMPLATE.md',
    '.github/PULL_REQUEST_TEMPLATE.md'
  ]
};

FILES['limit-to-dotfiles'] = ['bower.json'];

// add all files starting with a dot to this list
FILES.default.forEach(function(file) {
  if ((/^\./).test(file)) {
    FILES['limit-to-dotfiles'].push(file);
  }
});

FILES['limit-to-pkg'] = [
  'package.json',
  '.git'
];

FILES['limit-to-meta'] = []
  .concat(FILES['limit-to-pkg'])
  .concat(FILES['limit-to-dotfiles']);

export const GENERATOR_PATH = path.join(__dirname, '../generators/app');

/**
 * Gets a joined array of filenames from the FILES object.
 *
 * @function fileList
 * @param  {...String} Keys from FILES
 * @return {Array}
 */
export const fileList = function(...list) {
  return _.union(...list.map(str => FILES[str]));
};

/**
 * Set up options to always skip installation.
 *
 * @function options
 * @param  {...Object} Same as Object.assign
 * @return {Object}
 */
export const options = function(...args) {
  return _.assign(...[{skipInstall: true}].concat(args));
};

/**
 * Function to call when `before` setup is complete.
 *
 * This function expects to be bound to a RunContext: `onEnd.bind(this)`;
 *
 * @function onEnd
 * @param    {Function} [done]
 */
export const onEnd = function(done) {

  // There are cases where a package.json will not be created.
  try {
    this.pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  } catch (x) {
    this.pkg = null;
  }

  if (typeof done === 'function') {
    done();
  }
};

/**
 * Assert that all keys listed in an array match non-empty values
 * in an object.
 *
 * @param  {Object} obj
 * @param  {Array}  checks
 * @return {Boolean}
 */
export const allAreNonEmpty = function(obj, checks) {
  checks.forEach(key => {
    const s = obj[key];

    assert.ok(
      typeof s === 'string' && (/\S/).test(s),
      `"${key}" was a non-empty string`
    );
  });
};
