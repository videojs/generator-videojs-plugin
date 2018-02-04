/**
 * Rollup configuration for packaging the plugin in various formats.
 */
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import multiEntry from 'rollup-plugin-multi-entry';
import resolve from 'rollup-plugin-node-resolve';

const primedBabel = babel({
  babelrc: false,
  exclude: 'node_modules/**',
  presets: [
    ['es2015', {
      loose: true,
      modules: false
    }]
  ],
  plugins: [
    'external-helpers',
    'transform-object-assign'
  ]
});

const primedCommonJS = commonjs({sourceMap: false});
const primedJson = json();
const primedMultiEntry = multiEntry({exports: false});

const primedResolve = resolve({
  browser: true,
  main: true,
  jsnext: true
});

const distExternal = [
  'global',
  'global/window',
  'global/document',
  'video.js'
];

const distGlobals = {
  'video.js': 'videojs',
  'global': 'window',
  'global/window': 'window',
  'global/document': 'document'
};

const testExternal = [
  'qunit',
  'qunitjs',
  'sinon',
  'video.js'
];

const testGlobals = {
  'qunit': 'QUnit',
  'qunitjs': 'QUnit',
  'sinon': 'sinon',
  'video.js': 'videojs'
};

export default [{
  input: 'src/plugin.js',
  output: {
    name: '<%= moduleName %>',
    file: 'dist/<%= pluginName %>.js',
    format: 'umd',
    globals: distGlobals
  },
  external: distExternal,
  plugins: [primedResolve, primedJson, primedCommonJS, primedBabel]
}, {
  input: 'src/plugin.js',
  output: [{
    file: 'dist/<%= pluginName %>.cjs.js',
    format: 'cjs',
    globals: distGlobals
  }, {
    file: 'dist/<%= pluginName %>.es.js',
    format: 'es',
    globals: distGlobals
  }],
  external: distExternal,
  plugins: [primedJson, primedBabel]
}, {
  input: 'test/**/*.test.js',
  output: {
    name: '<%= moduleName %>Tests',
    file: 'test/dist/bundle.js',
    format: 'iife',
    globals: testGlobals
  },
  external: testExternal,
  plugins: [primedMultiEntry, primedResolve, primedJson, primedCommonJS, primedBabel]
}];
