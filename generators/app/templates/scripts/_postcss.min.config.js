const banner = require('./banner');
const path = require('path');

module.exports = function(context) {
  return {
    from: path.join(__dirname, '..', 'dest', '<%= pluginName %>.css'),
    to: path.join(__dirname, '..', 'dest', '<%= pluginName %>.min.css'),
    plugins: [
      require('cssnano')({safe: true}),
    ]
  }
}
