var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

var version = require(path.join(__dirname, '../package.json')).version;
var commands = [];

try {
  fs.statSync(path.join(__dirname, '../CHANGELOG.md'));
  commands = commands.concat([
    'chg release "' + version + '"',
    'git add CHANGELOG.md'
  ]);
} catch (x) {
  console.log('Skipping CHANGELOG.md update because it does not exist.');
}

try {
  fs.statSync(path.join(__dirname, '../bower.json'));
  commands = commands.concat([
    'git add package.json',
    'git commit -m "' + version + '"',
    'npm run build',
    'git add -f dist'
  ]);
} catch (x) {
  console.log('Skipping Bower tasks because bower.json does not exist.');
}

exec(commands.join(' && '), function(err, stdout, stderr) {
  if (err) {
    process.stdout.write(err.stack);
    process.exit(err.status || 1);
  } else {
    process.stdout.write(stdout);
  }
});
