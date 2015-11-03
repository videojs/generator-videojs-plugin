/* global describe, before, it */

'use strict';

var libs = require('./libs');
var _ = require('lodash');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('videojs-plugin:app options', function() {

  describe('--bcov', function() {
    before(function(done) {
      helpers.run(libs.generatorPath)
        .withOptions(libs.options({
          bcov: true
        }))
        .withPrompts({
          name: 'options-bcov',
          author: 'ignored',
          license: 'ignored'
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('produces expected package properties and file(s)', function() {
      assert.strictEqual(this.pkg.author, 'Brightcove, Inc.');
      assert.strictEqual(this.pkg.license, 'Apache-2.0');
      assert.ok(_.isUndefined(this.pkg.private));
      assert.file(libs.fileList('oss'));
    });
  });

  describe('--private', function() {
    before(function(done) {
      helpers.run(libs.generatorPath)
        .withOptions(libs.options({
          private: true
        }))
        .withPrompts({
          name: 'options-private',
          author: 'Jane Doe',
          license: 'ignored'
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('produces expected package properties and file(s)', function() {
      assert.strictEqual(this.pkg.author, 'Jane Doe');
      assert.strictEqual(this.pkg.license, 'Private/Proprietary');
      assert.strictEqual(this.pkg.private, true);
      assert.noFile(libs.fileList('oss'));
    });
  });

  describe('--bcov + --private', function() {
    before(function(done) {
      helpers.run(libs.generatorPath)
        .withOptions(libs.options({
          bcov: true,
          private: true
        }))
        .withPrompts({
          name: 'options-bcov-private',
          author: 'ignored',
          license: 'ignored'
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('produces expected package properties and file(s)', function() {
      assert.strictEqual(this.pkg.author, 'Brightcove, Inc.', 'enforces');
      assert.strictEqual(this.pkg.license, 'Private/Proprietary');
      assert.strictEqual(this.pkg.private, true);
      assert.noFile(libs.fileList('oss'));
    });
  });
});
