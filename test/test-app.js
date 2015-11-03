/* global describe, before, it */

'use strict';

var libs = require('./libs');
var _ = require('lodash');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('videojs-plugin:app', function() {

  before(function(done) {
    helpers.run(libs.generatorPath)
      .withOptions(libs.options())
      .withPrompts({
        name: 'common',
        author: 'John Doe'
      })
      .on('end', libs.onEnd.bind(this, done));
  });

  it('sets basic package properties', function() {
    assert.strictEqual(this.pkg.author, 'John Doe');
    assert.strictEqual(this.pkg.license, 'MIT');
    assert.strictEqual(this.pkg.name, 'videojs-common');
    assert.strictEqual(this.pkg.version, '0.0.0');
    assert.strictEqual(this.pkg.main, 'src/plugin.js');
    assert.ok(_.isArray(this.pkg.keywords));
    assert.ok(_.isPlainObject(this.pkg['browserify-shim']));
    assert.ok(_.isPlainObject(this.pkg.standard));
    assert.ok(_.isPlainObject(this.pkg.dependencies));
    assert.ok(_.isPlainObject(this.pkg.devDependencies));
  });

  it('has all scripts, even if they are empty', function() {
    libs.allExist(this.pkg.scripts, [
      'build',
      'build-css',
      'build-js',
      'clean',
      'clean-css',
      'clean-dist',
      'clean-js',
      'lint',
      'mkdist',
      'postversion',
      'prestart',
      'pretest',
      'preversion',
      'start',
      'test',
      'version',
      'watch',
      'watch-css',
      'watch-js',
      'watch-test'
    ]);
  });

  it('creates common default set of files', function() {
    assert.file(libs.fileList('common', 'oss', 'grunt'));
  });
});
