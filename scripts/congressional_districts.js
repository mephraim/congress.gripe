var fs = require('fs');
var Baby = require('babyparse');
var Promise = require('promise');

module.exports = {
  getDistrictDataFromCsv: getDistrictDataFromCsv
};

/**
 * Parses the congressional district file from the census site and returns a formatted
 * JSON file for the app.
 *
 * The congressional district file is the 115th congressional district file
 * downloaded from:
 *
 * http://www.census.gov/geo/maps-data/data/gazetteer2016.html
 *
 * @returns {Promise}
 */
function getDistrictDataFromCsv() {
  return new Promise(function(resolve, reject) {
    fs.readFile('data/congressional_districts.txt', 'utf8', function(err, data) {
      resolve(Baby.parse(data, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      }).data.map(function(result) {
        return _formatResultForJSON(result);
      }));
    });
  });
}

/**
 * Formats a result from the parsed congressional district file as object for
 * our app.
 *
 * @private
 * @param {Object[]}
 * @returns {Object[]}
 */
function _formatResultForJSON(result) {
  return {
    // GEOD is the state FIPS ID + the Congressional District ID
    district: parseInt(result.GEOID.toString().substr(2)),
    lat: result.INTPTLAT,
    lng: result.INTPTLONG,
    state: result.USPS
  };
}
