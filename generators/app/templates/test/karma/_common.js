var _ = require('lodash');

var DEFAULTS = {
  basePath: '../..',
  frameworks: ['browserify', 'qunit'],

  files: [
    'dist/<%= packageName %>.css',
    'node_modules/sinon/pkg/sinon.js',
    'node_modules/sinon/pkg/sinon-ie.js',
    'node_modules/video.js/dist/video.js',
    'test/**/*.js'
  ],

  exclude: [
    'test/bundle.js'
  ],

  plugins: [
    'karma-browserify',
    'karma-qunit'
  ],

  preprocessors: {
    'test/**/*.js': ['browserify']
  },

  reporters: ['dots'],
  port: 9876,
  colors: true,
  autoWatch: false,
  singleRun: true,
  concurrency: Infinity,

  browserify: {
    transform: [
      'babelify',
      'browserify-shim'
    ]
  }
};

/**
 * Generates a new Karma config with a common set of base configuration.
 *
 * @param  {Object} custom
 *         Configuration that will be deep-merged. Arrays will be
 *         concatenated.
 * @return {Object}
 */
module.exports = function(custom) {
  return _.merge(
    {},
    custom,
    DEFAULTS,
    function(target, source) {
      if (_.isArray(target)) {
        return target.concat(source);
      }
    }
  )
};
