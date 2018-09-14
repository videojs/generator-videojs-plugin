/* eslint-disable no-console */

const helpers = require('yeoman-test');
const libs = require('../test/libs.js');
const spawnSync = require('child_process').spawnSync;
const path = require('path');
const fs = require('fs');

let tempDir;
const templateLock = path.join(__dirname, '..', 'generators', 'app', 'templates', '_package-lock.json');

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
    const spawnOptions = {cwd: process.cwd(), stdio: 'inherit'};
    const cleanup = function() {
      console.log(`Cleaning up ${tempDir}`);
      spawnSync('shx', ['rm', '-rf', tempDir], spawnOptions);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGQUIT', cleanup);
    process.on('exit', cleanup);

    const shx = path.join(__dirname, '..', 'node_modules', '.bin', 'shx');

    const install = spawnSync('npm', ['i', '--package-lock-only'], Object.assign(spawnOptions, {cwd: tempDir}));

    if (!install.status === 0) {
      throw new Error('npm install failed!');
    }

    const copy = spawnSync(shx, ['cp', path.join(tempDir, 'package-lock.json'), templateLock], spawnOptions);

    if (!copy.status === 0) {
      throw new Error('package-lock copy failed!');
    }

    const lock = JSON.parse(fs.readFileSync(templateLock));

    lock.name = '<%= packageName %>';
    lock.version = '<%= version %>';

    fs.writeFileSync(templateLock, JSON.stringify(lock, null, 2));

    // test is a success
    return Promise.resolve();
  }).then(() => {
    process.exit();
  }).catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
