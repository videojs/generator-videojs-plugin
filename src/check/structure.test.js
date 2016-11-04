import {isDir, isFile} from './lib';
import tap from 'tap';

tap.ok(isDir('src'), 'the "src/" directory exists');
tap.ok(isDir('src/js/'), 'the "src/js/" directory exists');
tap.ok(isFile('src/js/index.js'), 'the "src/plugin.js" file exists');
tap.ok(isDir('test'), 'the "test/" directory exists');
tap.ok(isFile('test/index.test.js'), 'the "test/plugin.test.js" file exists');
tap.ok(isFile('.editorconfig'), 'the ".editorconfig" file exists');
tap.ok(isFile('.gitignore'), 'the ".gitignore" file exists');
tap.ok(isFile('.npmignore'), 'the ".npmignore" file exists');
tap.ok(isFile('CHANGELOG.md'), 'the "CHANGELOG.md" file exists');
tap.ok(isFile('index.html'), 'the "index.html" file exists');
tap.ok(isFile('README.md'), 'the "README.md" file exists');
