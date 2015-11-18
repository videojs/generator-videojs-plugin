var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var util = require('util');
var assert = require('yeoman-generator').assert;

module.exports = {

  generatorPath: path.join(__dirname, '../generators/app'),

  // Files that are expected to exist in certain conditions.
  files: {

    common: [
      'scripts/banner.ejs',
      'scripts/npm-postversion.sh',
      'scripts/npm-preversion.sh',
      'scripts/npm-version.sh',
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

    grunt: [
      'scripts/grunt.js',
      'Gruntfile.js'
    ],

    npm: [
      'scripts/server.js'
    ],

    sass: [
      'src/plugin.scss'
    ]
  },

  /**
   * Gets a joined array of filenames from the FILES object.
   *
   * @function fileList
   * @param  {...String} Keys from FILES
   * @return {Array}
   */
  fileList: function() {
    return _.union.apply(_, _.toArray(arguments).map(function (str) {
      return this.files[str];
    }, this));
  },

  /**
   * Set up options to always skip installation.
   *
   * @function options
   * @param  {...Object} Same as _.merge
   * @return {Object}
   */
  options: function() {
    return _.merge.apply(_, [{skipInstall: true}].concat(_.toArray(arguments)));
  },

  /**
   * Function to call when "before all" setup is complete.
   *
   * This expects to be bound: onEnd.bind(this, done);
   *
   * @function onEnd
   * @param    {Function} done
   */
  onEnd: function(done) {
    this.pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    done();
  },

  /**
   * Determine if all npm scripts listed in the array appear to be grunt aliases.
   *
   * @param  {Object} scripts
   * @param  {Array} checks
   * @return {Boolean}
   */
  allAreGruntAliases: function(scripts, checks) {
    checks.forEach(function(script) {
      assert.ok(
        _.startsWith(scripts[script], 'grunt'),
        util.format('"%s" was a grunt alias', script)
      );
    });
  },

  /**
   * Determine if all npm scripts listed in the array are non-empty strings.
   *
   * @param  {Object} scripts
   * @param  {Array} checks
   * @return {Boolean}
   */
  allAreNonEmpty: function(scripts, checks) {
    checks.forEach(function(script) {
      assert.ok(
        _.isString(scripts[script]) && (/\S/).test(scripts[script]),
        util.format('"%s" was a non-empty string', script)
      );
    });
  },

  /**
   * Determine if all npm scripts listed exist (even if empty).
   *
   * @param  {Object} scripts
   * @param  {Array} checks
   * @return {Boolean}
   */
  allExist: function(scripts, checks) {
    checks.forEach(function(script) {
      assert.ok(
        scripts.hasOwnProperty(script),
        util.format('"%s" exists', script)
      );
    });
  }
};
