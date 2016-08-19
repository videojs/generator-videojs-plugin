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
      assert.file(libs.fileList('oss'));
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
      const expected = libs.fileList('dotfiles', 'dotfiles:oss', 'pkg', 'scripts');
      const unexpected = _.difference(
        libs.fileList('bower', 'common', 'oss', 'sass'),
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
      const expected = libs.fileList('dotfiles', 'dotfiles:oss');
      const unexpected = _.difference(
        libs.fileList('bower', 'common', 'oss', 'sass'),
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
      const expected = libs.fileList('pkg');
      const unexpected = _.difference(
        libs.fileList('bower', 'common', 'oss', 'sass'),
        expected
      );

      assert.file(expected);
      assert.noFile(unexpected);
    });
  });

  describe('--limit-to=scripts', function() {
    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options({
          limitTo: 'scripts'
        }))
        .withPrompts({
          name: 'options-limit-to=scripts',
          author: 'ignored',
          description: 'doesn\'t matter',
          license: 'mit'
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('produces expected files (and not unexpected files)', function() {
      const expected = libs.fileList('scripts');
      const unexpected = _.difference(
        libs.fileList('bower', 'common', 'oss', 'sass'),
        expected
      );

      assert.file(expected);
      assert.noFile(unexpected);
    });
  });

  describe('--limit-to=dotfiles,scripts', function() {
    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options({
          limitTo: 'dotfiles,scripts'
        }))
        .withPrompts({
          name: 'options-limit-to=dotfiles,scripts',
          author: 'ignored',
          description: 'doesn\'t matter',
          license: 'mit'
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('produces expected files (and not unexpected files)', function() {
      const expected = libs.fileList('dotfiles', 'dotfiles:oss', 'scripts');
      const unexpected = _.difference(
        libs.fileList('bower', 'common', 'oss', 'sass'),
        expected
      );

      assert.file(expected);
      assert.noFile(unexpected);
    });
  });

  describe('--limit-to=pkg,scripts (with garbage)', function() {
    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options({
          limitTo: 'pkg,  scripts ,\tfoo\t,   bar '
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
      const expected = libs.fileList('pkg', 'scripts');
      const unexpected = _.difference(
        libs.fileList('bower', 'common', 'oss', 'sass'),
        expected
      );

      assert.file(expected);
      assert.noFile(unexpected);
    });
  });
});
