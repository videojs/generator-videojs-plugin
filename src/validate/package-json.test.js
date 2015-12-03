import {isNonEmptyString, isObject, subtests} from './lib';
import test from 'tape';

test('package.json', t => {
  const pkg = require(`${process.cwd()}/package.json`);

  subtests(t, {

    exists(tt) {
      tt.ok(typeof pkg === 'object', 'package.json returns an object');
      tt.end();
    },

    '"name"'(tt) {
      tt.ok(isNonEmptyString(pkg.name), 'package.json has a "name" property');
      tt.end();
    },

    '"description"'(tt) {
      tt.ok(
        isNonEmptyString(pkg.description),
        'package.json has a "description" property'
      );
      tt.end();
    },

    '"author"'(tt) {
      tt.ok(
        isObject(pkg.author) || isNonEmptyString(pkg.author),
        'package.json has an "author" property'
      );
      tt.end();
    },

    '"scripts"'(tt) {
      tt.ok(isObject(pkg.scripts), 'package.json has an "scripts" object');
      tt.end();
    },

    'core "scripts"'(tt) {
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
    }
  });

  t.end();
});
