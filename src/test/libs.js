import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import {assert} from 'yeoman-generator';

// Files that are expected to exist in certain conditions.
const FILES = {

  common: [
    'scripts/banner.ejs',
    'scripts/server.js',
    'test/karma/chrome.js',
    'test/karma/common.js',
    'test/karma/detected.js',
    'test/karma/firefox.js',
    'test/karma/ie.js',
    'test/karma/safari.js',
    'src/plugin.js',
    'test/index.html',
    'test/plugin.test.js',
    '.editorconfig',
    '.gitignore',
    '.npmignore',
    'CHANGELOG.md',
    'CONTRIBUTING.md',
    'index.html',
    'README.md'
  ],

  oss: [
    '.travis.yml',
    'LICENSE'
  ],

  sass: [
    'src/plugin.scss'
  ],

  bower: [
    'scripts/npm-version-for-bower.js',
    'bower.json'
  ]
};

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
  this.pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
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
    let s = obj[key];

    assert.ok(
      typeof s === 'string' && (/\S/).test(s),
      `"${key}" was a non-empty string`
    );
  });
};
