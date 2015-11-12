var common = require('./common');

module.exports = function(config) {
  config.set(common({

    frameworks: ['detectBrowsers'],

    plugins: [
      'karma-chrome-launcher',
      'karma-detect-browsers',
      'karma-firefox-launcher',
      'karma-ie-launcher',
      'karma-opera-launcher',
      'karma-safari-launcher'
    ],

    detectBrowsers: {
      usePhantomJS: false
    }
  }));
};
