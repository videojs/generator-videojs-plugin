import {isNonEmptyString, isObject} from './lib';
import test from 'tape';

test('package.json', t => {
  const pkg = require(`${process.cwd()}/package.json`);

  t.test('exists', (tt) => {
    tt.ok(typeof pkg === 'object', 'package.json returns an object');
    tt.end();
  });

  t.test('"name"', (tt) => {
    tt.ok(isNonEmptyString(pkg.name), 'package.json has a "name" property');
    tt.end();
  });

  t.test('"description"', (tt) => {
    tt.ok(
      isNonEmptyString(pkg.description),
      'package.json has a "description" property'
    );
    tt.end();
  });

  t.test('"author"', (tt) => {
    tt.ok(
      isObject(pkg.author) || isNonEmptyString(pkg.author),
      'package.json has an "author" property'
    );
    tt.end();
  });

  t.test('"scripts"', (tt) => {
    tt.ok(isObject(pkg.scripts), 'package.json has an "scripts" object');
    tt.end();
  });

  t.test('core "scripts"', (tt) => {
    [
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
    ].forEach(script => {
      tt.ok(
        isNonEmptyString(pkg.scripts[script]),
        `package.json "scripts" has a "${script}" script`
      );
    });
    tt.end();
  });

  t.end();
});
