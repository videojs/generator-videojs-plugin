const banner = require('./banner');
const path = require('path');

module.exports = function(context) {
  return {
    from: path.join(__dirname, '..', 'src', 'plugin.css'),
    to: path.join(__dirname, '..', 'dest', '<%= pluginName %>.css'),
    plugins: [
      require('postcss-banner')({important: true, banner}),
      require('postcss-import')(),
      require('autoprefixer')(['defaults', 'ie11']),
    ]
  }
}
