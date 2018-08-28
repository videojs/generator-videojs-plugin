/* eslint-disable no-console */

const helpers = require('yeoman-test');
const libs = require('../test/libs.js');
const spawnSync = require('child_process').spawnSync;

let tempDir = '';

helpers.run(libs.GENERATOR_PATH)
  .inTmpDir(function(dir) {
    tempDir = dir;
  })
  .withOptions(libs.options())
  .withPrompts({
    name: 'integration-test',
    author: 'John Doe',
    description: 'wat is the plugin',
    docs: true,
    lang: true,
    css: true,
    prepush: true,
    precommit: true
  })
  .then(function() {
    const installRetval = spawnSync('npm', ['i'], {
      stdio: 'inherit',
      env: process.env,
      cwd: tempDir
    });

    if (installRetval.status !== 0) {
      console.error('npm i failed');
      process.exit(1);
    }

    const testRetval = spawnSync('npm', ['run', 'test'], {
      stdio: 'inherit',
      env: process.env,
      cwd: tempDir
    });

    if (testRetval.status !== 0) {
      console.error('npm test failed');
      process.exit(1);
    }

    const rmRetval = spawnSync('shx', ['rm', '-rf', tempDir], {
      stdio: 'inherit',
      env: process.env,
      cwd: process.cwd()
    });

    if (rmRetval.status !== 0) {
      console.error('failed to rm temp dir ' + tempDir);
      process.exit(1);
    }
  });
