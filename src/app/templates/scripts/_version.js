var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var pkg = require(path.join(__dirname, '../package.json'));

/**
 * Determines whether or not the project has the CHANGELOG setup by checking
 * for the presence of a CHANGELOG.md file and the necessary dependency and
 * npm script.
 *
 * @return {Boolean}
 */
var hasChangelog = function() {
  try {
    fs.statSync(path.join(__dirname, '../CHANGELOG.md'));
  } catch (x) {
    return false;
  }
  return pkg.devDependencies.hasOwnProperty('chg') &&
    pkg.scripts.hasOwnProperty('change');
};

/**
 * Determines whether or not the project has the Bower setup by checking for
 * the presence of a bower.json file.
 *
 * @return {Boolean}
 */
var hasBower = function() {
  try {
    fs.statSync(path.join(__dirname, '../bower.json'));
    return true;
  } catch (x) {
    return false;
  }
};

var commands = [];

// If the project has a CHANGELOG, update it for the new release.
if (hasChangelog()) {
  commands = commands.concat([
    'chg release "' + pkg.version + '"',
    'git add CHANGELOG.md'
  ]);
}

// If the project supports Bower, perform special extra versioning step.
if (hasBower()) {
  commands = commands.concat([
    'git add package.json',
    'git commit -m "' + pkg.version + '"',

    // We only need a build in the Bower-supported case because of the
    // temporary addition of the dist/ directory.
    'npm run build',
    'git add -f dist'
  ]);
}

exec(commands.join(' && '), function(err, stdout, stderr) {
  if (err) {
    process.stdout.write(err.stack);
    process.exit(err.status || 1);
  } else {
    process.stdout.write(stdout);
  }
});
