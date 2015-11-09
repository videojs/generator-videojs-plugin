/* global describe, before, it */

'use strict';

var libs = require('./libs');
var _ = require('lodash');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('videojs-plugin:app grunt', function() {
  var scripts = [
    'build',
    'build-js',
    'build-test',
    'clean',
    'clean-dist',
    'clean-js',
    'clean-test',
    'start',
    'test',
    'watch',
    'watch-js',
    'watch-test'
  ];

  describe('grunt', function() {
    before(function(done) {
      helpers.run(libs.generatorPath)
        .withOptions(libs.options())
        .withPrompts({
          name: 'grunt-builder',
          author: 'Joe Schmoe',
          builder: 'grunt',
          sass: false
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('creates grunt-specific files', function() {
      assert.file(libs.fileList('common', 'oss', 'grunt'));
    });

    it('does NOT create npm-specific or sass-specific files', function() {
      assert.noFile(libs.fileList('npm', 'sass'));
    });

    it('populates otherwise empty npm scripts with grunt aliases', function() {
      libs.allAreGruntAliases(this.pkg.scripts, scripts);
    });
  });

  describe('grunt + sass', function() {
    before(function(done) {
      helpers.run(libs.generatorPath)
        .withOptions(libs.options())
        .withPrompts({
          name: 'grunt-builder',
          author: 'Joe Schmoe',
          builder: 'grunt',
          sass: true
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('creates grunt-specific and sass-specific files', function() {
      assert.file(libs.fileList('common', 'oss', 'grunt', 'sass'));
    });

    it('does NOT create npm-specific files', function() {
      assert.noFile(libs.fileList('npm'));
    });

    it('populates otherwise empty npm scripts with grunt aliases', function() {
      libs.allAreGruntAliases(this.pkg.scripts, scripts.concat([
        'build-css',
        'clean-css',
        'watch-css'
      ]));
    });
  });
});
