import _ from 'lodash';
import tap from 'tap';
import {isNonEmptyString} from './lib';

const pkg = require(`${process.cwd()}/package.json`);

const coreScripts = [
  'build',
  'clean',
  'lint',
  'release',
  'start',
  'test',
  'watch'
];

const publishedFiles = [
  'CONTRIBUTING.md',
  'CHANGELOG.md',
  'README.md',
  'dist/docs',
  'dist/lang',
  'dist/es5',
  'dist/browser',
  'index.html',
  'src/',
  'docs/'
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

tap.equal(pkg.main, 'dist/es5/index.js', 'package.json "main" is "dist/es5/index.js"');
tap.equal(pkg['jsnext:main'], 'src/js/index.js', 'package.json "main" is "src/js/index.js"');

tap.ok(
  isNonEmptyString(pkg['generator-videojs-plugin'].version),
  'package.json "generator-videojs-plugin.version" exists'
);

tap.ok(_.isPlainObject(pkg.spellbook), 'package.json has "spellbook" object');

_.forEach(pkg.spellbook, (value) => {
  tap.ok(_.isBoolean(value) || _.isObject(value), `package.json "spellbook.${k}" is an appropriate type`);
});

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

tap.ok(publishedFiles.every(f => pkg.files.indexOf(f) > -1), 'package.json "files" has expected contents');
