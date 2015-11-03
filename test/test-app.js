/* global describe, before, it */

'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('videojs-plugin:app', function() {

  before(function(done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({skipInstall: true})
      .withPrompts({someOption: true})
      .on('end', done);
  });

  it('creates files', function() {
    assert.file([
      'bower.json',
      'package.json',
      '.editorconfig',
    ]);
  });``
});
