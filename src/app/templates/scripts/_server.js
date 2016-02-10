import Promise from 'bluebird';
import browserify from 'browserify';
import budo from 'budo';
import fs from 'fs';
import glob from 'glob';
import mkdirp from 'mkdirp';
<% if (sass) { -%>
import sass from 'node-sass';
<% } -%>
import path from 'path';
<% if (lang) { -%>
import vjslangs from 'videojs-languages';
<% } -%>

/* eslint no-console: 0 */

const pkg = require(path.join(__dirname, '../package.json'));

// Replace "%s" tokens with the plugin name in a string.
const nameify = (str) =>
  str.replace(/%s/g, pkg.name.split('/').reverse()[0]);

const srces = {
<% if (sass) { -%>
  css: 'src/plugin.scss',
<% } -%>
  js: 'src/plugin.js',
<% if (lang) { -%>
  langs: 'lang/*.json',
<% } -%>
  tests: glob.sync('test/**/*.test.js')
};

const dests = {
<% if (sass) { -%>
  css: nameify('dist/%s.css'),
<% } -%>
  js: nameify('dist/%s.js'),
<% if (lang) { -%>
  langs: 'dist/lang',
<% } -%>
  tests: 'test/dist/bundle.js'
};

const bundlers = {

  js: browserify({
    debug: true,
    entries: [srces.js],
    standalone: nameify('%s'),
    transform: [
      'babelify',
      'browserify-shim',
      'browserify-versionify'
    ]
  }),

  tests: browserify({
    debug: true,
    entries: srces.tests,
    transform: [
      'babelify',
      'browserify-shim',
      'browserify-versionify'
    ]
  })
};

const bundle = (name) =>
  bundlers[name].bundle().pipe(fs.createWriteStream(dests[name]));

const server = budo({
  port: 9999,
  stream: process.stdout
});

const reload = () => {
  console.log('reloading');
  server.reload();
};

/**
 * A collection of functions which are mapped to strings that are used to
 * generate RegExp objects. If a filepath matches the RegExp, the function
 * will be used to handle that watched file.
 *
 * @type {Object}
 */
const handlers = {
<% if (lang) { -%>

  /**
   * Handler for language JSON files.
   *
   * @param  {String} event
   * @param  {String} file
   */
  '^lang/.+\.json$'(event, file) {
    console.log('re-compiling languages');
    vjslangs(srces.langs, dests.langs);
    reload();
  },
<% } -%>
<% if (sass) { -%>

  /**
   * Handler for Sass source.
   *
   * @param  {String} event
   * @param  {String} file
   */
  '^src/.+\.scss$'(event, file) {
    console.log('re-compiling sass');
    let result = sass.renderSync({file: srces.css, outputStyle: 'compressed'});

    fs.writeFileSync(dests.css, result.css);
    reload();
  },
<% } -%>

  /**
   * Handler for JavaScript source.
   *
   * @param  {String} event
   * @param  {String} file
   */
  '^src/.+\.js$'(event, file) {
    console.log('re-bundling javascript and tests');
    let js = new Promise((resolve, reject) => {
      bundle('js').on('finish', resolve).on('error', reject);
    });

    let tests = new Promise((resolve, reject) => {
      bundle('tests').on('finish', resolve).on('error', reject);
    });

    Promise.all([js, tests]).then(reload);
  },

  /**
   * Handler for JavaScript tests.
   *
   * @param  {String} event
   * @param  {String} file
   */
  '^test/.+\.test\.js$'(event, file) {
    console.log('re-bundling tests');
    bundle('tests').on('finish', reload);
  }
};

/**
 * Finds the first handler function for the file that matches a RegExp
 * derived from the keys.
 *
 * @param  {String} file
 * @return {Function|Undefined}
 */
const findHandler = (file) => {
  const keys = Object.keys(handlers);

  for (let i = 0; i < keys.length; i++) {
    let regex = new RegExp(keys[i]);

    if (regex.test(file)) {
      return handlers[keys[i]];
    }
  }
};

mkdirp('dist');
bundle('js');
bundle('tests');

server
  .live()
  .watch([
    'index.html',
<% if (lang) { -%>
    'lang/*.json',
<% } -%>
<% if (sass) { -%>
    'src/**/*.{scss,js}',
<% } else { -%>
    'src/**/*.js',
<% } -%>
    'test/**/*.test.js',
    'test/index.html'
  ])
  .on('watch', (event, file) => {
    const handler = findHandler(file);

    console.log(`detected a "${event}" event in "${file}"`);

    if (handler) {
      handler(event, file);
    } else {
      console.log(`detected a "${event}" event in unmatched file "${file}"`);
      reload();
    }
  });
