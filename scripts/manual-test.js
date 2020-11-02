/* eslint-disable no-console */

const helpers = require('yeoman-test');
const libs = require('../test/libs.js');

let tempDir;

helpers.run(libs.GENERATOR_PATH)
  .inTmpDir(function(dir) {
    tempDir = dir;
    console.log('Generating Project in a temp directory... ');
  })
  .withOptions(Object.assign(libs.options(), {skipInstall: false}))
  .withPrompts({
    name: 'manual-test',
    author: 'John Doe',
    description: 'wat is the plugin',
    docs: true,
    lang: true,
    css: true,
    prepush: false,
    precommit: true,
    library: true
  })
  .then(function() {
    console.log(`Generated Project in ${tempDir}`);
    console.log('be sure to clean it up when your done!');
  });
