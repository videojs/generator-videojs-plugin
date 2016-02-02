var connect = require('connect');
var cowsay = require('cowsay');
var path = require('path');
var portscanner = require('portscanner');
var serveStatic = require('serve-static');

// Configuration for the server.
var PORT = 9999;
var MAX_PORT = PORT + 100;
var HOST = '127.0.0.1';

var app = connect();

app.use(serveStatic(path.join(__dirname, '..')));

portscanner.findAPortNotInUse(PORT, MAX_PORT, HOST, function(error, port) {
  if (error) {
    throw error;
  }

  process.stdout.write(cowsay.say({
    text: 'Chewing the cud on ' + HOST + ':' + port
  }) + '\n\n');

  app.listen(port);
});
