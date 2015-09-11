var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.getFile = function(filePath, res) {
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) {
      console.log('error reading file');
      throw err;
    }
    exports.serveAssets(res, data, function() {
      console.log("success");
    });
  });
};

exports.sendResponse = function(res, statusCode) {
  statusCode = statusCode || 200;
  res.writeHead(statusCode, headers);
  res.end('');
};

exports.serveAssets = function(res, asset, callback, statusCode) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  statusCode = statusCode || 200;
  res.writeHead(statusCode, headers);
  res.end(asset);
  callback();
};





// As you progress, keep thinking about what helper functions you can put here!
