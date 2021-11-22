
var http = require('http');
var fs = require('fs');
var soap = require('soap');
var WSDL_FILENAME = '/qbws.wsdl';

var port = process.env.QB_SOAP_PORT || 8000;

function buildWsdl() {
  var wsdl = fs.readFileSync(__dirname + WSDL_FILENAME, 'utf8');
  return wsdl;
}

var wsdl = buildWsdl();
var webService = require('./web-service-new');
var server  = require('../bin/www');


//http.createServer(function (req, res) {
  //res.writeHead(200, {'Content-Type': 'text/html'});
  //res.end('Hello World!');
//}).listen(8080);


/* var server = http.createServer(function(req, res) {
  res.end('404: Not Found: ' + req.url);
});
server.listen(8000); */


soap.listen(server, '/wsdl', webService.service, wsdl, function(){
  console.log('server initialized');
});



console.log('Quickbooks SOAP Server listening on port ' + port);
