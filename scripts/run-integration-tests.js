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

    const vjsVerify = path.join(tempDir, 'node_modules', '.bin', 'vjsverify');

    const commands = [
      ['git', 'init'],
      ['npm', 'install'],
      ['npm', 'ci'],
      ['git', 'add', '--all'],
      ['git', 'commit', '-a', '-m', 'feat: initial release!'],
      ['npm', 'version', 'major'],
      [vjsVerify, '--verbose']
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

    const stat = fs.statSync(path.join(tempDir, 'CHANGELOG.md'));

    assert.ok(stat.size > 0, 'changelog was written to');

    // test is a success
    return Promise.resolve();
  }).then(() => {
    process.exit();
  }).catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
