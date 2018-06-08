/* eslint-disable no-console */
const banner = require('./banner').string;
const postcss = require('postcss');
const path = require('path');
const fs = require('fs');
const browsersList = require('./browserslist');
const {performance} = require('perf_hooks');
const startTime = performance.now();

const printOutput_ = function(from, to) {
  const relativeFrom = path.relative(process.cwd(), from);
  const relativeTo = path.relative(process.cwd(), to);
  const timeTaken = Math.round(performance.now() - startTime);

  console.log(`${relativeFrom} -> ${relativeTo} in ${timeTaken}ms`);
};

/**
 * A postcss plugin that should be run before minification plugins.
 * it will write to the `to` from the command line with the current
 * output. Then it will change the extension of the `to` from
 * whatever it is to `.min.css`
 */
const unminifiedOutput = postcss.plugin('postcss-unminified-output', function(opts) {
  opts = opts || {};

  return function(root, result) {
    const dist = result.opts.to;

    fs.writeFile(dist, root.toString(), function(err) {
      if (err) {
        throw new Error(err);
      }

      printOutput_(result.opts.from, dist);
    });

    result.opts.to = result.opts.to.replace(path.extname(result.opts.to), '.min.css');
  };
});

/**
 * by default there is no way to print that file was written
 * this does that.
 */
const printOutput = postcss.plugin('postcss-print-output', function(opts) {
  opts = opts || {};

  return function(root, results) {
    printOutput_(results.opts.from, results.opts.to);
  };
});

module.exports = function(context) {
  return {
    plugins: [
      // inlines local file imports
      require('postcss-import')(),

      // allows you to use newer css features, by converting
      // them into something browsers can support now.
      // see https://preset-env.cssdb.org/features
      // by default we use stage 3+
      require('postcss-preset-env')({browsers: browsersList, stage: 2}),

      // adds a banner to the top of the file
      require('postcss-banner')({important: true, inline: true, banner}),

      // add/remove vendor prefixes based on browser list
      require('autoprefixer')(browsersList),

      // print and save the unminified output
      unminifiedOutput(),

      // minify
      require('cssnano')({
        safe: true,
        preset: ['default', {
          autoprefixer: browsersList
        }]
      }),

      // print the minified output
      printOutput()
    ]
  };
};
