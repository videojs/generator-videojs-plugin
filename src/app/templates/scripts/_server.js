var babelify = require('babelify');
var shim = require('browserify-shim');
var budo = require('budo');
var exec = require('child_process').exec;
var glob = require('glob');
var path = require('path');
var util = require('util');

var pkg = require(path.join(__dirname, '../package.json'));

// Replace "%s" tokens with the plugin name in a string.
var nameify = function(str) {
  return str.replace(/%s/g, pkg.name.split('/').reverse()[0]);
};

// Normalize strings to arrays and filter out empties.
var normalize = function(obj) {
  if (typeof obj === 'string') {
    obj = [obj];
  }
  return obj.filter(Boolean);
};

var server = budo({
  port: 9999,
  stream: process.stdout
});

/**
 * Execute CLI command(s) and reload the given file(s) or everything if none
 * are given.
 *
 * @param  {String|Array} cmd
 *         Can be an array of commands, which will be run in order.
 * @param  {String|Array} [outfile]
 *         If not given, triggers a hard reload.
 */
var execAndReload = function(cmd, outfile) {
  cmd = normalize(cmd);
  outfile = normalize(outfile);

  exec(cmd.join(' && '), function(err, stdout) {
    if (err) {
      console.error(err.stack);
    } else if (outfile.length) {
      console.log('Reloading "%s"', outfile.join('", "'));
      outfile.forEach(server.reload);
    } else {
      console.log('Hard reload!');
      server.reload();
    }
  });
};

var handlers = {

  /**
   * Handler for JavaScript source.
   *
   * @param  {String} file
   * @return {Function|Undefined}
   */
  '^src/.+\.js$': function(event, file) {
    var outfiles = [
      nameify('dist/%s.js'),
      nameify('dist/%s.min.js'),
      'test/dist/bundle.js'
    ];

    console.log('Re-compiling JavaScript and tests');
    execAndReload(['npm run build:js', 'npm run build:test'], outfiles);
  },

  '^test/.+\.test\.js$': function(event, file) {
    console.log('Re-compiling tests');
    execAndReload('npm run build:test', 'test/dist/bundle.js');
  },

  '^lang/.+\.json$': function(event, file) {
    var outfile = util.format('dist/lang/%s.js', path.basename(file, '.json'));

    console.log('Re-compiling languages');
    execAndReload('npm run build:lang', outfile);
  },

  '^src/.+\.scss$': function(event, file) {
    console.log('Re-compiling Sass');
    execAndReload('npm run build:css', nameify('dist/%s.css'));
  }
};

/**
 * Finds the first handler function for the file that matches a RegExp
 * derived from the keys.
 *
 * @param  {String} file
 * @return {Function|Undefined}
 */
var findHandler = function(file) {
  var keys = Object.keys(handlers);
  var regex;

  for (var i = 0; i < keys.length; i++) {
    regex = new RegExp(keys[i]);
    if (regex.test(file)) {
      return handlers[keys[i]];
    }
  }
};

server
  .live()
  .watch([
    'index.html',
    'lang/*.json',
    'src/**/*.{scss,js}',
    'test/**/*.test.js',
    'test/index.html'
  ])
  .on('watch', function(event, file) {
    var handler = findHandler(file);

    console.log('Detected a "%s" event in "%s"', event, file);

    if (handler) {
      handler(event, file);
    } else {
      console.log('Unmatched file, hard reload!', event, file);
      server.reload();
    }
  });
