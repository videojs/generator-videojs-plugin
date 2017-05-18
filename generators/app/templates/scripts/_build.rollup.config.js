import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import path from 'path';

export default {
  moduleName: '<%= moduleName %>',
  entry: 'src/plugin.js',
  external: ['video.js'],
  globals: {
    'video.js': 'videojs'
  },
  legacy: true,
  plugins: [
    resolve({
      browser: true,
      main: true,
      jsnext: true
    }),
    json(),
    commonjs({
      sourceMap: false
    }),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [
        <% if (ie8) { %>'es3',<% } %>
        ['es2015', {
          loose: true,
          modules: false
        }]
      ],
      plugins: [
        'external-helpers',
        'transform-object-assign'
      ]
    })
  ],
  targets: [
    {dest: 'dist/<%= pluginName %>.js', format: 'umd'},
    {dest: 'dist/<%= pluginName %>.cjs.js', format: 'cjs'},
    {dest: 'dist/<%= pluginName %>.es.js', format: 'es'}
  ]
};
