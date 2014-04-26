/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('videojs-plugin generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('videojs-plugin:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      // add files you expect to exist here.
      '.jshintrc',
      '.editorconfig',
      'README.md',
      'package.json',
      'LICENSE-MIT',
      'lib/videojs-generated-plugin.js',
      'test/index.html',
      'test/videojs-generated-plugin.test.js'
    ];

    helpers.mockPrompt(this.app, {
      'pluginName': 'videojs-generated-plugin',
      'license': 'MIT'
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });
});
