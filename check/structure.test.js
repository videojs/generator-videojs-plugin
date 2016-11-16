import {isDir, isFile} from './lib';
import tap from 'tap';

// Required files/folders.
[
  'src',
  'src/js',
  'test'
].forEach(f => {
  tap.ok(isDir(f), `the "${f}/" directory exists`);
});

[
  'src/js/index.js',
  'test/index.test.js',
  '.gitignore',
  '.npmignore',
  'CHANGELOG.md',
  'index.html',
  'README.md'
].forEach(f => {
  tap.ok(isFile(f), `the "${f}" file exists`);
});

// Optional files/folders.
const pkg = require(`${process.cwd()}/package.json`);

if (pkg.spellbook) {

  if (pkg.spellbook.css !== false) {
    const cssFiles = ['index.css', 'index.scss', 'index.sass'].map(f => `src/css/${f}`);

    tap.ok(cssFiles.find(isFile), `one of these files exists: "${cssFiles.join('", "')}"`);
  }

  if (pkg.spellbook.docs !== false) {
    tap.ok(isDir('docs'), 'the "docs" directory exists');
  }

  if (pkg.spellbook.lang !== false) {
    tap.ok(isDir('lang'), 'the "lang" directory exists');
  }
}
