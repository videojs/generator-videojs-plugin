const rollupPlugins = require('./primed-rollup-plugins');
const nodeStatic = require('node-static');
const path = require('path');
const files = new nodeStatic.Server(path.join(__dirname, '..'), {cache: false});
const testGlobals = {
  'qunit': 'QUnit',
  'qunitjs': 'QUnit',
  'sinon': 'sinon',
  'video.js': 'videojs'
};

const StaticMiddlewareFactory = function(config) {
  console.log(`> Dev server started at http://${config.listenAddress}:${config.port}/`);
  return function(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache,must-revalidate');

    req.addListener('end', () => {
      files.serve(req, res, (err) => {
        if (err) {
          next();
        }

        console.log([
          (new Date()).toISOString(),
          `[${response.statusCode}]`,
          request.url
        ].join(' '));
      });
    }).resume();
  };
};

module.exports = function(config) {
  const detectBrowsers = {
    enabled: false,
    usePhantomJS: false
  };

  // On Travis CI, we can only run in Firefox and Chrome; so, enforce that.
  if (process.env.TRAVIS) {
    config.browsers = ['Firefox', 'travisChrome'];
  }

  // If no browsers are specified, we enable `karma-detect-browsers`
  // this will detect all browsers that are available for testing
  if (config.browsers !== false && !config.browsers.length) {
    detectBrowsers.enabled = true;
  }

  config.set({
    basePath: '..',
    frameworks: ['qunit', 'detectBrowsers'],
    files: [
      'node_modules/video.js/dist/video-js.css',
      <% if (css) { %><link href="dist/<%= pluginName %>.css" rel="stylesheet"><% } %>
      'node_modules/sinon/pkg/sinon.js',
      'node_modules/video.js/dist/video.js',
      {included: false, pattern: 'src/**/*.js', watched: true},
      // Make sure to disable Karma’s file watcher
      // because the preprocessor will use its own.
      {pattern: 'test/**/*.test.js', watched: false}
    ],
    customLaunchers: {
      travisChrome: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    client: {
      clearContext: false,
      qunit: {
        showUI: true,
        testTimeout: 5000
      }
    },
    detectBrowsers,
    reporters: ['dots'],
    port: 9999,
    urlRoot: '/test/',
    plugins: [
      {'middleware:static': ['factory', StaticMiddlewareFactory]},
      'karma-*'
    ],
    middleware: ['static'],
    colors: true,
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity,
    preprocessors: {
      'test/**/*.test.js': ['rollup']
    },
    rollupPreprocessor: {
      output: {
        format: 'iife',
        name: '<%= moduleName %>Test',
        globals: testGlobals
      },
      external: testGlobals,
      plugins: [
        rollupPlugins.multiEntry,
        rollupPlugins.resolve,
        rollupPlugins.json,
        rollupPlugins.commonjs,
        rollupPlugins.babel
      ]
    }
  });
};
