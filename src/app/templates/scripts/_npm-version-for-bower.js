var execSync = require('child_process').execSync;
var VERSION = require('../package.json').version;

[
  'git add package.json',
  'git commit -m "' + VERSION + '"',
  'npm run build',
  'git add -f dist'
].forEach(function(cmd) {
  try {
    process.stdout.write(execSync(cmd));
  } catch (x) {
    if (x.stderr) {
      process.stderr.write(x.stderr);
    }
    process.exit(x.status || 1);
  }
});
