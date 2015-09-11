var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) {
      console.log(err); 
    } else {
      var sitesArray = data.split('\n');
      callback(sitesArray);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(urls) {
    callback(_.contains(urls, url));
  });
};

exports.addUrlToList = function(url, callback){
  exports.isUrlInList(url, function(isInList) {
    if (!isInList) {
      fs.appendFile(exports.paths.list, url + '\n', 'utf8', function(err) {
        if (err) {
          console.log('error adding url to list: ', err);
        } else {
          callback();    
        }
      });
    } else {
      console.log('already in list');
    }
  });   
};

exports.isUrlArchived = function(url, callback) {
  var filePath = path.join(exports.paths.archivedSites, url);
  fs.open(filePath, 'r', function(err, data) {
    var exists = true;
    if (err) {
      exists = false;
    }
    callback(exists, url);
  });
};

exports.archiveSite = function(url, callback) {
  request('http://' + url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      fs.writeFile(path.join(exports.paths.archivedSites, url), body, 'utf8', function(err) {
        if (err) {
          console.log('error archiving site: ', err);
        } else {
          callback();
        }
      }); 
    }
  });
};

exports.downloadUrls = function(array) {
  for (var i = 0; i < array.length; i++) {
    exports.isUrlArchived(array[i], function(exists, url) {
      if (!exists) {
        exports.archiveSite(url, function() {
          console.log("Site archived");          
        });
      }
    });
  }
};
