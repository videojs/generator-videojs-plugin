import {isDir, isFile} from './lib';
import tap from 'tap';

tap.ok(isDir('scripts'), 'the "scripts/" directory exists');
tap.ok(isDir('src'), 'the "src/" directory exists');
tap.ok(isFile('src/plugin.js'), 'the "src/plugin.js" file exists');
tap.ok(isDir('test'), 'the "test/" directory exists');
tap.ok(isDir('test/karma'), 'the "test/karma/" directory exists');
tap.ok(isFile('test/plugin.test.js'), 'the "test/plugin.test.js" file exists');
tap.ok(isFile('index.html'), 'the "index.html" file exists');
tap.ok(isFile('README.md'), 'the "README.md" file exists');
