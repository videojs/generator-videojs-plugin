/* eslint-disable no-console */
const banner = require('./banner').string;
const postcss = require('postcss');
const path = require('path');
const fs = require('fs');
const {performance} = require('perf_hooks');
const startTime = performance.now();

// default is: > 0.5%, last 2 versions, Firefox ESR, not dead
// we add on ie 11 since we still support that.
// see https://github.com/browserslist/browserslist for more info
const browserList = ['defaults', 'ie 11'];

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
      require('postcss-banner')({important: true, inline: true, banner}),
      require('postcss-import')(),
      require('autoprefixer')(browserList),
      unminifiedOutput(),
      require('cssnano')({
        safe: true,
        preset: ['default', {
          autoprefixer: browserList
        }]
      }),
      printOutput()
    ]
  };
};
