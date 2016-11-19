var fs = require('fs');
var govTrack = require('govtrack-node');
var path = require('path');
var Promise = require('promise');

var CONGRESS_PATH = path.resolve(__dirname, '../data/congress.json');

module.exports = {
  getDataFromAPI: getDataFromAPI
};

function getDataFromAPI() {
  return new Promise(function(resolve, reject) {
    govTrack.findRole({ current: true, limit: 1000 }, function(error, response) {
      resolve(response);
    });
  });
}
