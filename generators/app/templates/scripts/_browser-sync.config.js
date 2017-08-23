var path = require('path');
var BASE_PATH = path.join(__dirname, '..');

var bsConfig = {
  server: {
    baseDir: BASE_PATH,
  },
  ui: {
    port: 9998
  },
  port: 9999,
  watchOptions: {
    ignored: [path.join(BASE_PATH, 'node_modules')],
  },
  middleware: [
    function(req, res, next) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
      next();
    }
  ],
  ghostMode: false,
  open: false,
  injectChanges: false,
  reloadOnRestart: true,
  tunnel: false,
  files: [
    path.join(BASE_PATH, '**', '*.html'),
    path.join(BASE_PATH, 'test', 'dist', '*'),
    path.join(BASE_PATH, 'dist', '*')
  ]
};

module.exports = bsConfig;
