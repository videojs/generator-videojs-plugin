const banner = require('./banner');
const postcss = require('postcss');
const path = require('path');
const fs = require('fs');

const browserList = ['defaults', 'ie 11'];

/**
 * A postcss plugin that should be run before minification plugins.
 * it will write to the `to` from the command line with the current
 * output. Then it will change the extension of the `to` from
 * whatever it is to `.min.css`
 */
const unminifiedOutput = postcss.plugin('postcss-unminified-output', function(opts) {
  opts = opts || {};

  return function(root, result) {
    fs.writeFileSync(result.opts.to, root.toString());

    result.opts.to = result.opts.to.replace(path.extname(result.opts.to), '.min.css');
  };
});

module.exports = function(context) {
  return {
    plugins: [
      require('postcss-banner')({important: true, banner}),
      require('postcss-import')(),
      require('autoprefixer')(browserList),
      unminifiedOutput(),
      require('cssnano')({
        safe: true,
        preset: ['default', {
          autoprefixer: browserList
        }]
      })
    ]
  };
};
