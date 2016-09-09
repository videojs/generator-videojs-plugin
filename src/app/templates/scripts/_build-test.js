import browserify from 'browserify';
import fs from 'fs';
import glob from 'glob';

/* eslint no-console: 0 */

glob('test/**/*.test.js', (err, files) => {
  if (err) {
    throw err;
  }
  browserify(files)
    .bundle()
    .pipe(fs.createWriteStream('dist/test/bundle.js'));
});
