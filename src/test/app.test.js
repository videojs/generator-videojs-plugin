/* global before, describe, it */

import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import {assert, test as helpers} from 'yeoman-generator';

import * as libs from './libs';
import packageJSON from '../generators/app/package-json';

describe('videojs-plugin:app', function() {
  const scripts = [
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
    'postversion'
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

    it('populates versioning scripts', function() {
      assert.strictEqual(
        this.pkg.scripts.version,
        'node scripts/version.js'
      );

      assert.strictEqual(
        this.pkg.scripts.postversion,
        'node scripts/postversion.js'
      );
    });

    it('creates common default set of files', function() {
      assert.file(libs.fileList('common', 'oss', 'bower'));
    });
  });

  describe('scoped package support', function() {

    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options())
        .withPrompts({
          scope: 'herp',
          name: 'derp',
          author: 'John Doe',
          description: 'it herps and derps'
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('includes the package name in scope', function() {
      assert.strictEqual(this.pkg.name, '@herp/videojs-derp');
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
        'build:css'
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
  });

  describe('existing package.json with author object', function() {

    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .inTmpDir(function(dir) {
          fs.copySync(path.join(__dirname, '../fixtures/author'), dir);
        })
        .withOptions(libs.options({force: true}))
        .withPrompts({
          name: 'nomen',
          author: 'ignore me',
          description: 'it is a plugin'
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('does not change the value of the author field', function() {
      let author = this.pkg.author;

      assert.ok(_.isPlainObject(author), 'the author is still an object');

      assert.strictEqual(
        author.name,
        'John Doe',
        'the author\'s name is correct'
      );

      assert.strictEqual(
        author.email,
        'john@doe.com',
        'the author\'s email is correct'
      );
    });
  });

  describe('package.json merging', function() {
    let result = packageJSON({
      a: 1,
      description: '',
      b: 2,
      name: '',
      c: 3,
      keywords: ['foo', 'bar']
    }, {
      author: 'Jane Doe',
      bower: false,
      className: 'vjs-test',
      description: 'This is the description',
      docs: false,
      functionName: 'test',
      isPrivate: false,
      lang: false,
      licenseName: 'MIT',
      packageName: `videojs-test`,
      pluginName: 'test',
      sass: false,
      version: '1.2.3',
      year: '2016'
    });

    it('overrides properties as expected', function() {
      assert.strictEqual(result.description, 'This is the description');
      assert.strictEqual(result.name, 'videojs-test');
      assert.strictEqual(result.version, '1.2.3');
    });

    it('retains any pre-existing ordering of keys', function() {
      let keys = Object.keys(result);

      assert.strictEqual(keys[0], 'a');
      assert.strictEqual(keys[1], 'description');
      assert.strictEqual(keys[2], 'b');
      assert.strictEqual(keys[3], 'name');
      assert.strictEqual(keys[4], 'c');
      assert.strictEqual(keys[5], 'keywords');
      assert.strictEqual(keys[6], 'version');
      assert.strictEqual(keys[7], 'main');
    });

    it('only adds keywords, does not remove any, and alphabetizes', function() {
      assert.strictEqual(result.keywords[0], 'bar');
      assert.strictEqual(result.keywords[1], 'foo');
      assert.strictEqual(result.keywords[2], 'videojs');
      assert.strictEqual(result.keywords[3], 'videojs-plugin');
    });
  });
});
