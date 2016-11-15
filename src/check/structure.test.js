import {isDir, isFile} from './lib';
import tap from 'tap';

// Required files/folders.
tap.ok(isDir('src'), 'the "src/" directory exists');
tap.ok(isDir('src/js/'), 'the "src/js/" directory exists');
tap.ok(isFile('src/js/index.js'), 'the "src/js/index.js" file exists');
tap.ok(isDir('test'), 'the "test/" directory exists');
tap.ok(isFile('test/index.test.js'), 'the "test/index.test.js" file exists');
tap.ok(isFile('.editorconfig'), 'the ".editorconfig" file exists');
tap.ok(isFile('.gitignore'), 'the ".gitignore" file exists');
tap.ok(isFile('.npmignore'), 'the ".npmignore" file exists');
tap.ok(isFile('CHANGELOG.md'), 'the "CHANGELOG.md" file exists');
tap.ok(isFile('index.html'), 'the "index.html" file exists');
tap.ok(isFile('README.md'), 'the "README.md" file exists');

// Optional files/folders.
const pkg = require(`${process.cwd()}/package.json`);

if (pkg.spellbook) {

  if (pkg.spellbook.css !== false) {
    const cssFiles = ['index.css', 'index.scss', 'index.sass'];
    const cssFile = cssFiles.find(fname => {
      return isFile(`src/css/${fname}`);
    });

    tap.ok(cssFile, `one of these files exists: ${cssFiles.join(',')}`);
  }

  if (pkg.spellbook.docs !== false) {
    tap.ok(isDir('docs'), 'the "docs" directory exists');
  }

  if (pkg.spellbook.lang !== false) {
    tap.ok(isDir('lang'), 'the "lang" directory exists');
  }
}
