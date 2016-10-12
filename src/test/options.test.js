/* global before, describe, it */

import * as libs from './libs';
import _ from 'lodash';
import {assert, test as helpers} from 'yeoman-generator';

describe('videojs-plugin:app options', function() {
  describe('--bcov', function() {
    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options({
          bcov: true
        }))
        .withPrompts({
          name: 'options-bcov',
          author: 'ignored',
          description: 'doesn\'t matter'
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('produces expected package properties and file(s)', function() {
      assert.strictEqual(this.pkg.author, 'Brightcove, Inc.');
      assert.strictEqual(this.pkg.license, 'Apache-2.0');
      assert.file(libs.fileList('default'));
    });
  });

  describe('--bcov + private license', function() {
    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options({
          bcov: true
        }))
        .withPrompts({
          name: 'options-bcov-private',
          author: 'ignored',
          description: 'doesn\'t matter',
          license: 'private'
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('produces expected package properties and file(s)', function() {
      assert.strictEqual(this.pkg.author, 'Brightcove, Inc.');
      assert.strictEqual(this.pkg.license, 'UNLICENSED');

      assert.noFile(libs.fileList('oss'));
      assert.file(libs.fileList('default'));
    });
  });

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
