/**
 * Rollup configuration for packaging the plugin in various formats.
 */
const plugins = require('./primed-rollup-plugins.js');
const banner = require('./banner.js');

// to prevent a screen during rollup watch
process.stderr.isTTY = false;

const umdGlobals = {
  'video.js': 'videojs',
  'global': 'window',
  'global/window': 'window',
  'global/document': 'document'
};
const moduleGlobals = {
  'video.js': 'videojs'
};

export default [{
  // umd
  input: 'src/plugin.js',
  output: {
    name: '<%= moduleName %>',
    file: 'dist/<%= pluginName %>.js',
    format: 'umd',
    globals: umdGlobals,
    banner
  },
  external: Object.keys(umdGlobals),
  plugins: [plugins.resolve, plugins.json, plugins.commonjs, plugins.babel]
}, {
  // minified umd
  input: 'src/plugin.js',
  output: {
    name: '<%= moduleName %>',
    file: 'dist/<%= pluginName %>.min.js',
    format: 'umd',
    globals: umdGlobals,
    banner
  },
  external: Object.keys(umdGlobals),
  plugins: [plugins.resolve, plugins.json, plugins.commonjs, plugins.uglify, plugins.babel]
}, {
  // cjs and es
  input: 'src/plugin.js',
  output: [
    {file: 'dist/<%= pluginName %>.cjs.js', format: 'cjs', globals: moduleGlobals, banner},
    {file: 'dist/<%= pluginName %>.es.js', format: 'es', globals: moduleGlobals, banner}
  ],
  external: Object.keys(moduleGlobals).concat(['global', 'global/window', 'global/document']),
  plugins: [plugins.json, plugins.babel]
}];
