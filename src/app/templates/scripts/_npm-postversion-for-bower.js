var shell = require('shelljs');
var VERSION = require('../package.json').version;

shell.exec('git reset --hard HEAD~1');
console.log('Finished version bump to v%s', VERSION);
