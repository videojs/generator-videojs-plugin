module.exports = function(config) {
  config.set({
    basePath: '../..',
    frameworks: ['browserify', 'detectBrowsers', 'qunit'],

    files: [
      'dist/<%= packageName %>.css',
      'node_modules/sinon/pkg/sinon.js',
      'node_modules/sinon/pkg/sinon-ie.js',
      'node_modules/video.js/dist/video.js',
      'test/unit/**/*.js'
    ],

    exclude: [
      'test/unit/dist/**/*'
    ],

    plugins: [
      'karma-browserify',
      'karma-chrome-launcher',
      'karma-detect-browsers',
      'karma-firefox-launcher',
      'karma-ie-launcher',
      'karma-opera-launcher',
      'karma-qunit',
      'karma-safari-launcher'
    ],

    preprocessors: {
      'test/unit/**/*.js': ['browserify']
    },

    reporters: ['dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity,

    browserify: {
      transform: [
        'babelify',
        'browserify-shim'
      ]
    },

    detectBrowsers: {
      usePhantomJS: false
    }
  })
}
