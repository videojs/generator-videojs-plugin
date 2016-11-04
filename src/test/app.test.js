/* global before, describe, it */

import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import {assert, test as helpers} from 'yeoman-generator';

import * as libs from './libs';
import packageJSON from '../generators/app/package-json';
import generatorVersion from '../generators/app/generator-version';

describe('videojs-plugin:app', function() {
  const scripts = [
    'clean',
    'build',
    'lint',
    'prepublish',
    'start',
    'watch',
    'test',
    'postversion',
    'release'
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
      assert.strictEqual(this.pkg.author, 'John Doe', 'author exists');
      assert.strictEqual(this.pkg.license, 'MIT', 'licence exists');
      assert.strictEqual(this.pkg.name, 'videojs-wat', 'pkg name exists');
      assert.strictEqual(this.pkg.description, 'wat is the plugin', 'description exists');
      assert.strictEqual(this.pkg.version, '0.0.0', 'version is set');
      assert.strictEqual(this.pkg.main, 'dist/es5/index.js', 'main is set');
      assert.strictEqual(this.pkg['jsnext:main'], 'src/js/index.js', 'jsnext:main is set');
      assert.ok(_.isArray(this.pkg.keywords), 'keywords exist');
      assert.ok(_.isArray(this.pkg.files), 'files array exists');
      assert.ok(_.isPlainObject(this.pkg.devDependencies), 'devDependencies exists');
      assert.ok(_.isPlainObject(this.pkg.dependencies), 'dependencies exists');
      assert.ok(_.isPlainObject(this.pkg.spellbook), 'spellbook');
      assert.equal(typeof this.pkg['browserify-shim'], 'string', 'browserify-shim exists');
      assert.equal(this.pkg.spellbook.css, false, 'css should be disabled');
      assert.equal(this.pkg.spellbook.docs, false, 'docs should be disabled');
      assert.equal(this.pkg.spellbook.lang, false, 'lang should be disabled');
      assert.equal(typeof this.pkg.spellbook.ie8, 'undefined', 'ie8 should not be supported');
      assert.strictEqual(this.pkg.config.ghooks['pre-push'], 'npm run lint');
      assert.ok(_.isPlainObject(this.pkg['generator-videojs-plugin']));
      assert.strictEqual(this.pkg['generator-videojs-plugin'].version, generatorVersion());
    });

    it('has all scripts, even if they are empty', function() {
      libs.allAreNonEmpty(this.pkg.scripts, scripts);
    });

    it('creates all default files', function() {
      assert.file(libs.fileList('default', 'oss'));
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
      assert.strictEqual(this.pkg.name, '@herp/videojs-derp', 'scope is set on pkg name');
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
        .on('end', libs.onEnd.bind(this, done));
    });

    it('does not disable css in spellbook, creates css files', function() {
      assert.ok(_.isPlainObject(this.pkg.spellbook));
      assert.equal(typeof this.pkg.spellbook.css, 'undefined', 'css should not be disabled');
      assert.equal(this.pkg.spellbook.docs, false, 'docs should be disabled');
      assert.equal(this.pkg.spellbook.lang, false, 'lang should be disabled');
      assert.equal(typeof this.pkg.spellbook.ie8, 'undefined', 'ie8 should not be supported');
      assert.file(libs.fileList('default', 'oss', 'css'));
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

    it('does not disable docs in spellbook, creates doc files', function() {
      assert.ok(_.isPlainObject(this.pkg.spellbook));
      assert.equal(this.pkg.spellbook.css, false, 'css should be disabled');
      assert.equal(typeof this.pkg.spellbook.docs, 'undefined', 'docs should not be disabled');
      assert.equal(this.pkg.spellbook.lang, false, 'lang should be disabled');
      assert.equal(typeof this.pkg.spellbook.ie8, 'undefined', 'ie8 should not be supported');
      assert.file(libs.fileList('default', 'oss', 'docs'));
    });
  });

  describe('lang', function() {
    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options())
        .withPrompts({
          name: 'wat',
          author: 'John Doe',
          description: 'wat is the plugin',
          lang: true
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('does not disable lang in spellbook, creates lang files', function() {
      assert.ok(_.isPlainObject(this.pkg.spellbook));
      assert.equal(this.pkg.spellbook.css, false, 'css should be disabled');
      assert.equal(this.pkg.spellbook.docs, false, 'docs should be disabled');
      assert.equal(typeof this.pkg.spellbook.lang, 'undefined', 'lang should not be disabled');
      assert.equal(typeof this.pkg.spellbook.ie8, 'undefined', 'ie8 should not be supported');

      assert.file(libs.fileList('default', 'oss', 'lang'));
    });
  });

  describe('ie8', function() {
    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options())
        .withPrompts({
          name: 'wat',
          author: 'John Doe',
          description: 'wat is the plugin',
          ie8: true
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('does not disable ie8 in spellbook', function() {
      assert.ok(_.isPlainObject(this.pkg.spellbook));
      assert.equal(this.pkg.spellbook.css, false, 'css should be disabled');
      assert.equal(this.pkg.spellbook.docs, false, 'docs should be disabled');
      assert.equal(this.pkg.spellbook.lang, false, 'lang should be disabled');
      assert.equal(this.pkg.spellbook.ie8, true, 'ie8 should be supported');

      assert.file(libs.fileList('default', 'oss'));
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

    it('does not create bower-specific files, but does create everything else', function() {
      const files = libs.fileList('default', 'oss');
      const bowerFiles = libs.fileList('bower');

      bowerFiles.forEach(function(file) {
        const i = files.indexOf(file);

        if (i !== -1) {
          files.splice(i, 1);
        }
      });

      assert.noFile(bowerFiles);
      assert.file(files);
    });
  });

  describe('existing package.json with author object', function() {

    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .inTmpDir(function(dir) {
          fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({
            name: 'videojs-author-fixture',
            description: 'This is a fixture to test the handling of an author object.',
            author: {
              name: 'John Doe',
              email: 'john@doe.com'
            },
            license: 'MIT',
            version: '1.0.0'
          }));
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
      const author = this.pkg.author;

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

  describe('ghooks "none"', function() {
    before(function(done) {
      helpers.run(libs.GENERATOR_PATH)
        .withOptions(libs.options())
        .withPrompts({
          name: 'wat',
          author: 'John Doe',
          description: 'wat is the plugin',
          ghooks: 'none'
        })
        .on('end', libs.onEnd.bind(this, done));
    });

    it('does not cause a failure', function() {
      assert.ok(_.isPlainObject(this.pkg));
      assert.strictEqual(this.pkg.config, undefined);
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
      bower: false,
      className: 'vjs-test',
      description: 'This is the description',
      docs: false,
      functionName: 'test',
      isPrivate: false,
      lang: false,
      licenseName: 'MIT',
      packageName: 'videojs-test',
      pluginName: 'test',
      sass: false,
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

    it('handles merging the deep ghooks config object', function() {
      let pkg = packageJSON({}, {ghooks: 'lint'});

      assert.strictEqual(pkg.config.ghooks['pre-push'], 'npm run lint');
      pkg = packageJSON(pkg, {ghooks: 'none'});
      assert.strictEqual(
        pkg.config.ghooks,
        undefined,
        '"config.ghooks" is removed when set to none'
      );
      pkg = packageJSON(pkg, {ghooks: 'test'});
      assert.strictEqual(pkg.config.ghooks['pre-push'], 'npm run test');
      pkg = packageJSON(pkg, {ghooks: 'lint'});
      assert.strictEqual(pkg.config.ghooks['pre-push'], 'npm run lint');
    });
  });
});
