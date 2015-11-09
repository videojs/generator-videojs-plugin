/* global describe, before, it */

'use strict';

var libs = require('./libs');
var _ = require('lodash');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('videojs-plugin:app npm', function() {
  var scripts = [
    'build',
    'build-js',
    'build-test',
    'clean-dist',
    'clean-js',
    'clean-test',
    'start',
    // TODO: 'test',
    // TODO: 'watch',
    'watch-js',
    'watch-test'
  ];

  describe('npm', function() {
    before(function(done) {
      helpers.run(libs.generatorPath)
        .withOptions(libs.options())
        .withPrompts({
          name: 'npm-builder',
          author: 'Plain Jane',
          builder: 'npm',
          sass: false
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('creates npm-specific files', function() {
      assert.file(libs.fileList('npm', 'common', 'oss'));
    });

    it('does NOT create grunt-specific or sass-specific files', function() {
      assert.noFile(libs.fileList('grunt', 'sass'));
    });

    it('populates otherwise empty npm scripts', function() {
      libs.allAreNonEmpty(this.pkg.scripts, scripts);
    });
  });

  describe('npm + sass', function() {
    before(function(done) {
      helpers.run(libs.generatorPath)
        .withOptions(libs.options())
        .withPrompts({
          name: 'npm-builder',
          author: 'Plain Jane',
          builder: 'npm',
          sass: true
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('creates npm-specific and sass-specific files', function() {
      assert.file(libs.fileList('npm', 'common', 'oss', 'sass'));
    });

    it('does NOT create grunt-specific files', function() {
      assert.noFile(libs.fileList('grunt'));
    });

    it('populates otherwise empty npm scripts', function() {
      libs.allAreNonEmpty(this.pkg.scripts, scripts.concat([
        'build-css',
        'clean-css',
        'watch-css'
      ]));
    });
  });
});
