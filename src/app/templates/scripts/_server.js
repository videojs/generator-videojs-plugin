var babelify = require('babelify');
var shim = require('browserify-shim');
var budo = require('budo');
var exec = require('child_process').exec;
var glob = require('glob');
var path = require('path');
var util = require('util');

var pkg = require(path.join(__dirname, '../package.json'));

var pluginName = pkg.name.split('/').reverse()[0];

var server = budo({
  port: 9999,
  stream: process.stdout
});

/**
 * Execute a CLI command and reload the given file.
 *
 * @param  {String} script
 * @param  {String} outfile
 */
var execAndReload = function(script, outfile) {
  exec(script, function(err, stdout) {
    if (err) {
      console.error(err.stack);
      return;
    }
    if (outfile) {
      console.log('Reloading "%s"', outfile);
      server.reload(outfile);
    } else {
      console.log('Hard reload!');
      server.reload();
    }
  });
};

// Functions that handle different files by their extension.
var watchers = {

  js: function(event, file) {

    // Regardless of whether a source file or a test file changed, we want to
    // re-compile and reload test files.
    var tasks = ['npm run build:test'];
    var outfile = 'test/dist/bundle.js';
    var message = 'Re-compiling tests';

    // If this was _not_ a test file change, we need to re-compile and
    // reload the JavaScript as well, but since this is a change in two
    // bundles, we need to do a full reload.
    if (file.substr(0, 4) === 'src/') {
      tasks.push('npm run build:js');
      outfile = null;
      message += ' and JavaScript';
    }

    console.log(message);
    execAndReload(tasks.join(' && '), outfile);
  },

  json: function(event, file) {
    var outfile = util.format('dist/lang/%s.js', path.basename(file, '.json'));

    console.log('Re-compiling languages');
    execAndReload('npm run build:lang', outfile);
  },

  scss: function(event, file) {
    var outfile = util.format('dist/%s.css', pluginName);

    console.log('Re-compiling Sass');
    execAndReload('npm run build:css', outfile);
  }
};

server
  .watch([
    'index.html',
    'lang/*.json',
    'src/**/*.{scss,js}',
    'test/**/*.test.js',
    'test/index.html'
  ])
  .live()
  .on('watch', function(event, file) {
    var watcher = watchers[path.extname(file).substr(1)];

    console.log('Detected a "%s" in "%s"', event, file);

    if (watcher) {
      watcher(event, file);
    } else {
      console.log('Hard reload!', event, file);
      server.reload();
    }
  });
