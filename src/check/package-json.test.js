import {isNonEmptyString, isObject} from './lib';
import tap from 'tap';

const pkg = require(`${process.cwd()}/package.json`);

const scripts = [
  'build',
  'build:js',
  'build:test',
  'clean',
  'lint',
  'start',
  'test',
  'watch',
  'watch:js',
  'watch:test',
  'version'
];

tap.ok(typeof pkg === 'object', 'package.json exists');
tap.ok(isNonEmptyString(pkg.name), 'package.json has "name" property');

tap.ok(
  isNonEmptyString(pkg.description),
  'package.json has "description" property'
);

tap.ok(
  isObject(pkg.author) || isNonEmptyString(pkg.author),
  'package.json has "author" property'
);

tap.ok(isObject(pkg.scripts), 'package.json has "scripts" object');

scripts.forEach(script => {
  tap.ok(
    isNonEmptyString(pkg.scripts[script]),
    `package.json "scripts" has "${script}" script`
  );
});
