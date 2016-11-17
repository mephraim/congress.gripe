var fs = require('fs');
var path = require('path');

var CONGRESS_PATH = path.resolve(__dirname, '../data/congress.json');

module.exports = {
  getAll: function() {
    return JSON.parse(fs.readFileSync(CONGRESS_PATH)).objects;
  }
};
