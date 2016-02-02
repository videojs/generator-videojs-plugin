import _ from 'lodash';
import tap from 'tap';
import {isNonEmptyString} from './lib';

const pkg = require(`${process.cwd()}/package.json`);

const coreScripts = [
  'build',
  'build:js',
  'build:test',
  'clean',
  'lint',
  'start',
  'test',
  'version'
];

tap.ok(_.isPlainObject(pkg), 'package.json exists');
tap.ok(isNonEmptyString(pkg.name), 'package.json has "name" property');

tap.ok(
  isNonEmptyString(pkg.description),
  'package.json has "description" property'
);

tap.ok(
  _.isPlainObject(pkg.author) || isNonEmptyString(pkg.author),
  'package.json has "author" property'
);

tap.equal(pkg.main, 'es5/plugin.js', 'package.json "main" is "es5/plugin.js"');

['videojs', 'videojs-plugin'].forEach(kw => {
  tap.ok(_.includes(pkg.keywords, kw), `package.json has "${kw}" in "keywords"`);
});

tap.ok(_.isPlainObject(pkg.scripts), 'package.json has "scripts" object');

coreScripts.forEach(script => {
  tap.ok(
    isNonEmptyString(pkg.scripts[script]),
    `package.json "scripts" has "${script}" script`
  );
});
