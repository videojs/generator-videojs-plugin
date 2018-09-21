/* global Promise */
/* eslint-disable no-console */

const helpers = require('yeoman-test');
const libs = require('../test/libs.js');
const spawnSync = require('child_process').spawnSync;
const path = require('path');
const assert = require('assert');
const fs = require('fs');

let tempDir;

helpers.run(libs.GENERATOR_PATH)
  .inTmpDir(function(dir) {
    tempDir = dir;
    console.log(`Generating Project in ${tempDir}`);
  })
  .withOptions(Object.assign(libs.options(), {skipInstall: false}))
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
    const spawnOptions = {cwd: tempDir};

    const cleanup = function() {
      console.log(`Cleaning up ${tempDir}`);
      const result = spawnSync(
        path.join(tempDir, 'node_modules', '.bin', 'shx'),
        ['rm', '-rf', tempDir],
        spawnOptions
      );

      if (result.status !== 0) {
        console.error('Failed to cleanup');
      }
    };

    process.on('SIGINT', cleanup);
    process.on('SIGQUIT', cleanup);
    process.on('exit', cleanup);

    const commands = [
      ['git', 'init'],
      ['git', 'add', '--all'],
      ['git', 'commit', '-a', '-m', 'feat: initial release!'],
      ['npm', 'version', 'prerelease'],
      // copy the changelog over to check its size
      ['shx', 'cp', 'CHANGELOG.md', 'CHANGELOG-prerelease.md'],
      ['npm', 'version', 'major'],
      ['npm', 'publish', '--dry-run']
    ];

    commands.forEach(function(args) {
      const cmd = args.shift();
      const command = `${path.basename(cmd)} ${args.join(' ')}`;

      console.log(`Running '${command}'`);
      const retval = spawnSync(cmd, args, spawnOptions);

      if (retval.status !== 0) {
        const output = retval.output
          .filter((s) => !!s)
          .map((s) => s.toString())
          .join('');

        console.error(output);
        throw new Error(`${command} Failed`);
      }
    });

    const release = fs.statSync(path.join(tempDir, 'CHANGELOG.md'));
    const prerelease = fs.statSync(path.join(tempDir, 'CHANGELOG-prerelease.md'));

    assert.ok(prerelease.size === 0, 'changelog was not written to after prerelease');
    assert.ok(release.size > 0, 'changelog was written to after major');

    // test is a success
    return Promise.resolve();
  }).then(() => {
    process.exit();
  }).catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
