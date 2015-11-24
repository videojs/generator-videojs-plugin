/* global describe, before, it */

'use strict';

var libs = require('./libs');
var _ = require('lodash');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('videojs-plugin:app', function() {
  var scripts = [
    'build',
    'build:js',
    'build:test',
    'clean',
    'docs',
    'lint',
    'start',
    'test',
    'test:chrome',
    'test:firefox',
    'test:ie',
    'test:opera',
    'test:safari',
    'preversion',
    'version',
    'postversion',
    'watch',
    'watch:js',
    'watch:test',
  ];

  describe('defaults', function() {

    before(function(done) {
      helpers.run(libs.generatorPath)
        .withOptions(libs.options())
        .withPrompts({
          name: 'wat',
          author: 'John Doe'
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('sets basic package properties', function() {
      assert.strictEqual(this.pkg.author, 'John Doe');
      assert.strictEqual(this.pkg.license, 'MIT');
      assert.strictEqual(this.pkg.name, 'videojs-wat');
      assert.strictEqual(this.pkg.version, '0.0.0');
      assert.strictEqual(this.pkg.main, 'es5/plugin.js');
      assert.ok(_.isArray(this.pkg.keywords));
      assert.ok(_.isPlainObject(this.pkg['browserify-shim']));
      assert.ok(_.isPlainObject(this.pkg.standard));
      assert.ok(_.isPlainObject(this.pkg.devDependencies));
    });

    it('has all scripts, even if they are empty', function() {
      libs.allAreNonEmpty(this.pkg.scripts, scripts);
    });

    it('creates common default set of files', function() {
      assert.file(libs.fileList('common', 'oss'));
    });
  });

  describe('sass', function() {

    before(function(done) {
      helpers.run(libs.generatorPath)
        .withOptions(libs.options())
        .withPrompts({
          name: 'wat',
          author: 'John Doe',
          sass: true
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('populates otherwise empty npm scripts', function() {
      libs.allAreNonEmpty(this.pkg.scripts, scripts.concat([
        'build:css',
        'watch:css'
      ]));
    });

    it('creates npm-specific and sass-specific files', function() {
      assert.file(libs.fileList('common', 'oss', 'sass'));
    });
  });
});
