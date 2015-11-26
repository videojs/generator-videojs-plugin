import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import util from 'util';
import {assert} from 'yeoman-generator';

// Files that are expected to exist in certain conditions.
const FILES = {

  common: [
    'scripts/banner.ejs',
    'scripts/npm-postversion.sh',
    'scripts/npm-preversion.sh',
    'scripts/npm-version.sh',
    'scripts/server.js',
    'test/karma/chrome.js',
    'test/karma/common.js',
    'test/karma/detected.js',
    'test/karma/firefox.js',
    'test/karma/ie.js',
    'test/karma/opera.js',
    'test/karma/safari.js',
    'src/plugin.js',
    'test/index.html',
    'test/plugin.test.js',
    '.editorconfig',
    '.gitignore',
    '.npmignore',
    'bower.json',
    'CHANGELOG.md',
    'index.html',
    'README.md'
  ],

  oss: [
    '.travis.yml',
    'LICENSE',
    'CONTRIBUTING.md'
  ],

  sass: [
    'src/plugin.scss'
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
export const options = function(...options) {
  return _.assign(...[{skipInstall: true}].concat(options));
};

/**
 * Function to call when "before all" setup is complete.
 *
 * This expects to be bound: onEnd.bind(this, done);
 *
 * @function onEnd
 * @param    {Function} done
 */
export const onEnd = function(done) {
  this.pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  done();
};

/**
 * Determine if all npm scripts listed in the array are non-empty strings.
 *
 * @param  {Object} scripts
 * @param  {Array} checks
 * @return {Boolean}
 */
export const allAreNonEmpty = function(scripts, checks) {
  checks.forEach(script => {
    let s = scripts[script];
    assert.ok(
      typeof s === 'string' && (/\S/).test(s),
      `"${script}" was a non-empty string`
    );
  });
};
