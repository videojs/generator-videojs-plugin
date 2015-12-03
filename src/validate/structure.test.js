import {isDir, isFile, subtests} from './lib';
import test from 'tape';

test('structure', t => {

  subtests(t, {

    'scripts/'(tt) {
      tt.ok(isDir('scripts'), 'the scripts/ directory exists');
      tt.end();
    },

    'src/'(tt) {
      tt.ok(isDir('src'), 'the src/ directory exists');
      tt.end();
    },

    'src/plugin.js'(tt) {
      tt.ok(isFile('src/plugin.js'), 'the src/plugin.js file exists');
      tt.end();
    },

    'test/'(tt) {
      tt.ok(isDir('test'), 'the test/ directory exists');
      tt.end();
    },

    'test/karma/'(tt) {
      tt.ok(isDir('test/karma'), 'the test/karma/ directory exists');
      tt.end();
    },

    'test/plugin.test.js'(tt) {
      tt.ok(isFile('test/plugin.test.js'), 'the test/plugin.test.js file exists');
      tt.end();
    },

    'index.html'(tt) {
      tt.ok(isFile('index.html'), 'the index.html file exists');
      tt.end();
    },

    'README.md'(tt) {
      tt.ok(isFile('README.md'), 'the README.md file exists');
      tt.end();
    }
  });

  t.end();
});
