'use strict';

/* global before, describe, it */

const _ = require('lodash');
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fs = require('fs');

const libs = require('./libs');
const packageJSON = require('../generators/app/package-json');
const generatorVersion = require('../generators/app/generator-version');
const pluginPkg = require('../plugin/package.json');

describe('videojs-plugin:app', function() {
  const scripts = [
    'build',
    'clean',
    'lint',
    'start',
    'test',
    'preversion',
    'version',
    'watch'
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
        .on('end', () => libs.onEnd(this, done));
    });

    it('sets basic package properties', function() {
      const p = this.pkg;

      assert.strictEqual(p.author, 'John Doe');
      assert.strictEqual(p.license, 'MIT');
      assert.strictEqual(p.name, 'videojs-wat');
      assert.strictEqual(p.description, 'wat is the plugin');
      assert.strictEqual(p.version, '0.0.0');
      assert.strictEqual(p.main, 'dist/videojs-wat.cjs.js');
      assert.strictEqual(p.module, 'dist/videojs-wat.es.js');
      assert(_.isArray(p.keywords));
      assert(_.isPlainObject(p.vjsstandard));
      assert(_.isPlainObject(p.devDependencies));
      assert(_.isPlainObject(p['lint-staged']));
      assert.strictEqual(p.husky.hooks['pre-commit'], 'lint-staged');
      assert(_.isPlainObject(p['generator-videojs-plugin']));
      assert.strictEqual(p['generator-videojs-plugin'].version, generatorVersion());
    });

    it('has all scripts, even if they are empty', function() {
      libs.allAreNonEmpty(this.pkg.scripts, scripts);
    });

    it('creates common default set of files', function() {
      libs.fileList('common', 'oss').forEach(f => assert.file(f));
    });

    it('creates the expected plugin.js contents', function() {
      assert.fileContent('src/plugin.js', /class Wat extends Plugin/);
    });

  });

  describe('basic', function() {

    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options())
        .withPrompts({
          name: 'wat',
          author: 'John Doe',
          description: 'wat is the plugin',
          pluginType: 'basic'
        })
        .on('end', () => libs.onEnd(this, done));
    });

    it('sets basic package properties', function() {
      const p = this.pkg;

      assert.strictEqual(p.author, 'John Doe');
      assert.strictEqual(p.license, 'MIT');
      assert.strictEqual(p.name, 'videojs-wat');
      assert.strictEqual(p.description, 'wat is the plugin');
      assert.strictEqual(p.version, '0.0.0');
      assert.strictEqual(p.main, 'dist/videojs-wat.cjs.js');
      assert.strictEqual(p.module, 'dist/videojs-wat.es.js');
      assert(_.isArray(p.keywords));
      assert(_.isPlainObject(p.vjsstandard));
      assert(_.isPlainObject(p.devDependencies));

      assert(_.isPlainObject(p['lint-staged']));
      assert.strictEqual(p.husky.hooks['pre-commit'], 'lint-staged');
      assert(_.isPlainObject(p['generator-videojs-plugin']));
      assert.strictEqual(p['generator-videojs-plugin'].version, generatorVersion());
    });

    it('has all scripts, even if they are empty', function() {
      libs.allAreNonEmpty(this.pkg.scripts, scripts);
    });

    it('creates common default set of files', function() {
      libs.fileList('common', 'oss').forEach(f => assert.file(f));
    });

    it('creates the expected plugin.js contents', function() {
      assert.fileContent('src/plugin.js', /const wat = function/);
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
        .on('end', () => libs.onEnd(this, done));
    });

    it('includes the package name in scope', function() {
      assert.strictEqual(this.pkg.name, '@herp/videojs-derp');
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
        .on('end', () => libs.onEnd(this, done));
    });

    it('populates otherwise empty npm scripts', function() {
      libs.allAreNonEmpty(this.pkg.scripts, scripts.concat([
        'docs',
        'docs:api',
        'docs:toc'
      ]));
    });

    it('creates docs specific files default set of files', function() {
      libs.fileList('common', 'docs').forEach(f => assert.file(f));
    });
  });

  describe('all options', function() {

    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options())
        .withPrompts({
          name: 'wat',
          author: 'John Doe',
          description: 'wat is the plugin',
          docs: true,
          lang: true,
          css: true,
          prepush: true,
          precommit: true,
          library: true
        })
        .on('end', () => libs.onEnd(this, done));
    });

    it('populates otherwise empty npm scripts', function() {
      libs.allAreNonEmpty(this.pkg.scripts, scripts.concat([
        'docs',
        'docs:api',
        'docs:toc',
        'build:lang',
        'watch:css',
        'build:css'
      ]));

      assert.ok(this.pkg.husky.hooks['pre-push'], 'has pre-push husky script');
      assert.ok(this.pkg.husky.hooks['pre-commit'], 'has pre-commit husky script');
      assert.equal(Object.keys(this.pkg['lint-staged']).length, 2, 'adds two lint-staged entries');
    });

    it('lint works', function() {
      libs.allAreNonEmpty(this.pkg.dependencies, Object.keys(this.pkg.dependencies));
      libs.allAreNonEmpty(this.pkg.devDependencies, Object.keys(this.pkg.devDependencies));
    });

    it('does not have empty versions', function() {
      libs.allAreNonEmpty(this.pkg.dependencies, Object.keys(this.pkg.dependencies));
      libs.allAreNonEmpty(this.pkg.devDependencies, Object.keys(this.pkg.devDependencies));
    });

    it('should have the same deps as the template package', function() {

      const templatePackages = Object.keys(pluginPkg.dependencies).concat(Object.keys(pluginPkg.devDependencies)).sort();
      const packages = Object.keys(this.pkg.dependencies).concat(Object.keys(this.pkg.devDependencies)).sort();

      assert.deepEqual(templatePackages, packages, 'have the same packages');
    });
  });

  describe('css', function() {
    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options())
        .withPrompts({
          name: 'wat',
          author: 'John Doe',
          description: 'wat is the plugin',
          css: true
        })
        .on('end', () => libs.onEnd(this, done));
    });

    it('populates otherwise empty npm scripts', function() {
      libs.allAreNonEmpty(this.pkg.scripts, scripts.concat([
        'build:css',
        'watch:css'
      ]));
    });

    it('creates css specific files default set of files', function() {
      libs.fileList('common', 'oss', 'css').forEach(f => assert.file(f));
    });
  });

  describe('library', function() {
    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options())
        .withPrompts({
          name: 'wat',
          author: 'John Doe',
          description: 'wat is the plugin',
          library: true
        })
        .on('end', () => libs.onEnd(this, done));
    });

    it('populates otherwise empty npm scripts', function() {
      libs.allAreNonEmpty(this.pkg.scripts, scripts.concat([
        'build:es',
        'build:cjs',
        'build:es',
        'build:cjs'
      ]));
    });
  });

  describe('existing package.json with author object', function() {

    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .inTmpDir(function(dir) {
          const authorFixture = {
            name: 'videojs-author-fixture',
            description: 'This is a fixture to test the handling of an author object.',
            author: {
              name: 'John Doe',
              email: 'john@doe.com'
            },
            license: 'MIT',
            version: '1.0.0'
          };

          fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(authorFixture));
        })
        .withOptions(libs.options({force: true}))
        .withPrompts({
          name: 'nomen',
          author: 'ignore me',
          description: 'it is a plugin'
        })
        .on('end', () => libs.onEnd(this, done));
    });

    it('does not change the value of the author field', function() {
      const author = this.pkg.author;

      assert(_.isPlainObject(author), 'the author is still an object');

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

  describe('precommit false', function() {
    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options())
        .withPrompts({
          name: 'wat',
          author: 'John Doe',
          description: 'wat is the plugin',
          docs: true,
          precommit: false
        })
        .on('end', () => libs.onEnd(this, done));
    });

    it('package.json is as expected', function() {
      assert(_.isPlainObject(this.pkg));
      assert.strictEqual(this.pkg.husky.hooks['pre-commit'], undefined);
      assert.strictEqual(this.pkg['lint-staged'], undefined);

      assert.strictEqual(this.pkg.devDependencies.husky, undefined);
      assert.strictEqual(this.pkg.devDependencies['lint-staged'], undefined);
    });
  });

  describe('prepush false', function() {
    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options())
        .withPrompts({
          name: 'wat',
          author: 'John Doe',
          description: 'wat is the plugin',
          prepush: false
        })
        .on('end', () => libs.onEnd(this, done));
    });

    it('package.json is as expected', function() {
      assert(_.isPlainObject(this.pkg));
      assert.strictEqual(this.pkg.husky.hooks['pre-push'], undefined);
    });
  });

  describe('package.json merging', function() {
    const result = packageJSON({
      a: 1,
      description: '',
      b: 2,
      name: '',
      c: 3,
      keywords: ['foo', 'bar']
    }, {
      author: 'Jane Doe',
      className: 'vjs-test',
      description: 'This is the description',
      docs: false,
      pluginFunctionName: 'test',
      pluginClassName: 'Test',
      isPrivate: false,
      lang: false,
      licenseName: 'MIT',
      packageName: 'videojs-test',
      pluginName: 'test',
      version: '1.2.3'
    });

    it('overrides properties as expected', function() {
      assert.strictEqual(result.description, 'This is the description');
      assert.strictEqual(result.name, 'videojs-test');
      assert.strictEqual(result.version, '1.2.3');
    });

    it('retains any pre-existing ordering of keys', function() {
      const keys = Object.keys(result);

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
