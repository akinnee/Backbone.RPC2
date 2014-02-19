var rpc = require('./node-json-rpc');

var options = {
  // int port of rpc server, default 5080 for http or 5433 for https
  port: 5080,
  // string domain name or ip of rpc server, default '127.0.0.1'
  host: 'localhost',
  // string with default path, default '/'
  path: '/',
  // boolean false to turn rpc checks off, default true
  strict: true,
  // any custom headers to send with all responses
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
};

// Create a server object with options
var serv = new rpc.Server(options);

// Add your methods
serv.addMethod('create', function (params, callback) {
  var error, result;

  result = params;

  callback(error, result);
});

serv.addMethod('read', function (params, callback) {
  var error, result;

  result = {
    id: 123,
    name: 'Box of matches',
    price: 0.89
  };

  callback(error, result);
});

serv.addMethod('update', function (params, callback) {
  var error, result;

  result = params;

  callback(error, result);
});

serv.addMethod('delete', function (params, callback) {
  var error, result;

  result = {};

  callback(error, result);
});

// Start the server
serv.start(function (error) {
  // Did server start succeed ?
  if (error) throw error;
  else console.log('Server running ...');
});