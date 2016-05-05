/* global before, describe, it */

import _ from 'lodash';
import * as libs from './libs';
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

  describe('--spellbook', function() {
    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options({
          spellbook: true
        }))
        .withPrompts({
          name: 'options-spellbook',
          author: 'nobody',
          description: 'nothing',

          // We'll make sure all the options are set so we get a full test.
          bower: true,
          changelog: true,
          docs: true,
          lang: true,
          sass: true
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('produces expected files and does not produce others', function() {
      assert.file(
        libs.fileList('bower', 'oss', 'sass', 'spellbook'),
        'includes all expected files'
      );

      assert.noFile(
        _.difference(libs.fileList('common'), libs.fileList('spellbook')),
        'does not include files which spellbook should exclude'
      );
    });

    it('adds/removes expected package.json "devDependencies"', function() {
      let deps = this.pkg.devDependencies;

      [
        'babel',
        'babelify',
        'bannerize',
        'browserify',
        'browserify-shim',
        'budo',
        'mkdirp',
        'rimraf',
        'uglify-js',
        'videojs-languages'
      ].forEach(removed => {
        assert.ok(
          !deps.hasOwnProperty(removed),
          `the "${removed}" dev-dependency should not be present`
        );
      });

      ['videojs-spellbook'].forEach(added => {
        assert.ok(
          deps.hasOwnProperty(added),
          `the "${added}" dev-dependency should be present`
        );
      });
    });

    it('changes/removes expected package.json "scripts"', function() {
      let scripts = this.pkg.scripts;

      [
        'build:css:bannerize',
        'build:css:sass',
        'build:js:babel',
        'build:js:bannerize',
        'build:js:browserify',
        'build:js:uglify'
      ].forEach(r => {
        assert.ok(
          !scripts.hasOwnProperty(r),
          `the "${r}" script should not be present`
        );
      });

      _.each({
        'build:css': 'cast build-css',
        'build:js': 'cast build-js',
        'build:lang': 'cast build-langs',
        'build:test': 'cast build-tests',
        'clean': 'cast clean',
        'start': 'cast server',
        'test': 'cast test',
        'test:chrome': 'cast test chrome',
        'test:firefox': 'cast test firefox',
        'test:ie': 'cast test ie',
        'test:safari': 'cast test safari',
        'preversion': 'cast test',
        'version': 'cast version',
        'postversion': 'cast postversion'
      }, (val, key) => {
        assert.strictEqual(
          scripts[key],
          val,
          `the "${key}" script should be "${val}"`
        );
      });
    });
  });
});
