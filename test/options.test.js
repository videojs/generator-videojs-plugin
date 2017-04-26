/* global before, describe, it */

'use strict';

const libs = require('./libs');
const _ = require('lodash');
const assert = require('yeoman-generator').assert;
const helpers = require('yeoman-generator').test;

describe('videojs-plugin:app options', function() {

  describe('--limit-to-meta', function() {
    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options({
          limitToMeta: true
        }))
        .withPrompts({
          name: 'options-limit-to-meta',
          author: 'ignored',
          description: 'doesn\'t matter',
          license: 'mit'
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('produces expected files (and not unexpected files)', function() {
      const expected = libs.fileList('limit-to-meta');
      const unexpected = _.difference(
        libs.fileList('default'),
        expected
      );

      assert.file(expected);
      assert.noFile(unexpected);
    });
  });

  describe('--limit-to=dotfiles', function() {
    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options({
          limitTo: 'dotfiles'
        }))
        .withPrompts({
          name: 'options-limit-to=dotfiles',
          author: 'ignored',
          description: 'doesn\'t matter',
          license: 'mit'
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('produces expected files (and not unexpected files)', function() {
      const expected = libs.fileList('limit-to-dotfiles');
      const unexpected = _.difference(
        libs.fileList('default'),
        expected
      );

      assert.file(expected);
      assert.noFile(unexpected);
    });
  });

  describe('--limit-to=pkg', function() {
    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options({
          limitTo: 'pkg'
        }))
        .withPrompts({
          name: 'options-limit-to=pkg',
          author: 'ignored',
          description: 'doesn\'t matter',
          license: 'mit'
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('produces expected files (and not unexpected files)', function() {
      const expected = libs.fileList('limit-to-pkg');
      const unexpected = _.difference(
        libs.fileList('default'),
        expected
      );

      assert.file(expected);
      assert.noFile(unexpected);
    });
  });

  describe('--limit-to=pkg,dotfiles (with garbage)', function() {
    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options({
          limitTo: 'pkg,  dotfiles  ,\tfoo\t,   bar '
        }))
        .withPrompts({
          name: 'options-limit-to=pkg,scripts (with garbage)',
          author: 'ignored',
          description: 'doesn\'t matter',
          license: 'mit'
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('produces expected files (and not unexpected files)', function() {
      const expected = libs.fileList('limit-to-dotfiles', 'limit-to-pkg');
      const unexpected = _.difference(
        libs.fileList('default'),
        expected
      );

      assert.file(expected);
      assert.noFile(unexpected);
    });
  });
});
