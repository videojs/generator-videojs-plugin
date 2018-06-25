/* eslint-disable no-console, camelcase */
const serveStatic = require('serve-static');
const pkg = require('../package.json');

/* allow static files to be served, note karma will takeover the /test directory */
const StaticMiddlewareFactory = function(config) {
  console.log(`**** static file server started for ${config.basePath} *****`);

  const serve = serveStatic(
    config.basePath,
    {index: ['index.html', 'index.htm']}
  );

  return function(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache,must-revalidate');
    return serve(req, res, next);
  };
};

/* browsers to run on teamcity */
const teamcityLaunchers = {
  bsChrome: {
    base: 'BrowserStack',
    browser: 'chrome',
    os: 'Windows',
    os_version: '10'
  },

  bsFirefox: {
    base: 'BrowserStack',
    browser: 'firefox',
    os: 'Windows',
    os_version: '10'
  },

  bsSafariSierra: {
    base: 'BrowserStack',
    browser: 'safari',
    os: 'OS X',
    os_version: 'Sierra'
  },

  bsEdgeWin10: {
    base: 'BrowserStack',
    browser: 'edge',
    os: 'Windows',
    os_version: '10'
  },

  bsIE11Win10: {
    base: 'BrowserStack',
    browser: 'ie',
    browser_version: '11',
    os: 'Windows',
    os_version: '10'
  },

  bsIE11Win7: {
    base: 'BrowserStack',
    browser: 'ie',
    browser_version: '11',
    os: 'Windows',
    os_version: '7'
  }
};

/* browsers to run on travis */
const travisLaunchers = {
  travisFirefox: {
    base: 'Firefox'
  },
  travisChrome: {
    base: 'Chrome',
    flags: ['--no-sandbox']
  }
};

module.exports = function(config) {
  /* Default configuration */
  config.set({
    basePath: '..',
    frameworks: ['qunit', 'detectBrowsers'],
    customLaunchers: Object.assign({}, travisLaunchers, teamcityLaunchers),
    client: {clearContext: false, qunit: {showUI: true, testTimeout: 5000}},

    detectBrowsers: {
      enabled: false,
      usePhantomJS: false
    },
    browserStack: {
      project: process.env.TEAMCITY_PROJECT_NAME || pkg.name,
      name: '',
      build: process.env.TRAVIS_BUILD_NUMBER || process.env.BUILD_NUMBER,
      pollingTimeout: 30000,
      captureTimeout: 600,
      timeout: 600
    },
    reporters: ['dots'],
    files: [
      'node_modules/video.js/dist/video-js.css',<% if (css) { %>
      'dist/<%= pluginName %>.css',<% } %>
      'node_modules/sinon/pkg/sinon.js',
      'node_modules/video.js/dist/video.js',
      'test/dist/bundle.js'
    ],
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

    captureTimeout: 30000,
    browserNoActivityTimeout: 300000
  });

  /* dynamic configuration, for ci and detectBrowsers */

  // run browsers listed in travisLaunchers
  if (process.env.TRAVIS) {
    config.browsers = Object.keys(travisLaunchers);
    config.browserStack.name = process.env.TRAVIS_BUILD_NUMBER;
    if (process.env.TRAVIS_PULL_REQUEST !== 'false') {
      config.browserStack.name += process.env.TRAVIS_PULL_REQUEST;
      config.browserStack.name += ' ';
      config.browserStack.name += process.env.TRAVIS_PULL_REQUEST_BRANCH;
    }

    config.browserStack.name += ' ' + process.env.TRAVIS_BRANCH;

  // run browsers listed in teamcityLaunchers
  } else if (process.env.TEAMCITY_VERSION) {
    config.reporters.push('teamcity');
    config.browsers = Object.keys(teamcityLaunchers);
    config.browserStack.name = process.env.TEAMCITY_PROJECT_NAME;
    config.browserStack.name += '_';
    config.browserStack.name += process.env.BUILD_NUMBER;
  }

  // If no browsers are specified, we enable `karma-detect-browsers`
  // this will detect all browsers that are available for testing
  if (config.browsers !== false && !config.browsers.length) {
    config.detectBrowsers.enabled = true;
  }

};
