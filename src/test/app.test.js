import * as libs from './libs';
import _ from 'lodash';
import {assert, test as helpers} from 'yeoman-generator';

describe('videojs-plugin:app', function() {
  var scripts = [
    'build',
    'build:js',
    'build:test',
    'clean',
    'lint',
    'start',
    'test',
    'test:chrome',
    'test:firefox',
    'test:ie',
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
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options())
        .withPrompts({
          name: 'wat',
          author: 'John Doe',
          description: 'wat is the plugin'
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('sets basic package properties', function() {
      assert.strictEqual(this.pkg.author, 'John Doe');
      assert.strictEqual(this.pkg.license, 'MIT');
      assert.strictEqual(this.pkg.name, 'videojs-wat');
      assert.strictEqual(this.pkg.description, 'wat is the plugin');
      assert.strictEqual(this.pkg.version, '0.0.0');
      assert.strictEqual(this.pkg.main, 'es5/plugin.js');
      assert.ok(_.isArray(this.pkg.keywords));
      assert.ok(_.isPlainObject(this.pkg['browserify-shim']));
      assert.ok(_.isPlainObject(this.pkg.vjsstandard));
      assert.ok(_.isPlainObject(this.pkg.devDependencies));
    });

    it('has all scripts, even if they are empty', function() {
      libs.allAreNonEmpty(this.pkg.scripts, scripts);
    });

    it('populates versioning scripts for bower', function() {
      ['preversion', 'version', 'postversion'].forEach(s => {
        assert.strictEqual(this.pkg.scripts[s], `./scripts/npm-${s}-for-bower.sh`);
      });
    });

    it('creates common default set of files', function() {
      assert.file(libs.fileList('common', 'oss', 'bower'));
    });
  });

  describe('sass', function() {

    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options())
        .withPrompts({
          name: 'wat',
          author: 'John Doe',
          description: 'wat is the plugin',
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

  describe('docs', function() {

    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options())
        .withPrompts({
          name: 'wat',
          author: 'John Doe',
          description: 'wat is the plugin',
          docs: true
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('populates otherwise empty npm scripts', function() {
      libs.allAreNonEmpty(this.pkg.scripts, scripts.concat([
        'docs',
        'docs:api',
        'docs:toc'
      ]));
    });
  });

  describe('bower turned off', function() {

    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options())
        .withPrompts({
          name: 'wat',
          author: 'John Doe',
          description: 'wat is the plugin',
          bower: false
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('does not create bower-specific files', function() {
      assert.noFile(libs.fileList('bower'));
    });

    it('does not populate versioning scripts for bower', function() {
      ['preversion', 'version', 'postversion'].forEach(s => {
        assert.notStrictEqual(this.pkg.scripts[s], `./scripts/npm-${s}-for-bower.sh`);
      });
    });
  });
});
