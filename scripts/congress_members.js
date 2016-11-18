var fs = require('fs');
var govTrack = require('govtrack-node');
var path = require('path');
var Promise = require('promise');

var CONGRESS_PATH = path.resolve(__dirname, '../data/congress.json');

module.exports = {
  getDataFromAPI: function() {
    return new Promise(function(resolve, reject) {
      govTrack.findRole({ current: true }, function(error, response) {
        console.log('Loaded data...');
        resolve(response);
      });
    });
  },

  getDataFromFile: function() {
    return JSON.parse(fs.readFileSync(CONGRESS_PATH)).objects;
  }
};
