// Prepends a "banner" comment to a file (or files).

import ejs from 'ejs';
import fs from 'fs';
import minimist from 'minimist';
import path from 'path';

const argv = minimist(process.argv.slice(2));

const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'package.json'), {encoding: 'utf8'})
);

const year = (new Date()).getFullYear();

const banner = ejs.render(
  fs.readFileSync(path.join(__dirname, 'banner.ejs'), {encoding: 'utf8'}),
  {pkg, year}
);

argv._.forEach(arg => {
  let filename = path.join(__dirname, '..', arg);
  let content = fs.readFileSync(filename);

  fs.writeFileSync(filename, [banner, content].join('\n'));
});
