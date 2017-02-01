var babyparse = require('babyparse');
var fs = require('fs');
var Promise = require('promise');
var request = require('request');
var urls = require('../data/zip_code_congressional_district_urls.js');

module.exports = {
  getRawDataFiles: getRawDataFiles,
  parseRawDistrictData: parseRawDistrictData
};

/**
 * Download the raw census data files that map zipcodes to congressional districts.
 * @returns {Promise}
 */
function getRawDataFiles() {
  return new Promise(function(resolve) {
    var requests = Object.keys(urls).map(function(state) {
      return _getDataForState(state);
    });

    Promise.all(requests).then(function(responses) {
      resolve(responses);
    });
  });
};

/**
 * Parses the raw census data files for zipcode to congressional districts.
 * @returns {Promise}
 */
function parseRawDistrictData() {
  return new Promise(function(resolve) {
    // Build up a collection of parsers that will read in the zip code => district
    // csv files and return a zipcode map object for each state.
    var parsers = Object.keys(urls).map(function(state) {
      return _getZipMapFromRawData(state);
    });

    // Once all of the parsers have completed, resolve with one big object that
    // contains all of the zipcode to district data.
    Promise.all(parsers).then(function(zipMaps) {
      resolve(Object.assign.apply(Object, zipMaps));
    });
  });
}

/**
 * Returns an object that maps zip codes to congressional districts.
 *
 * @private
 * @param {Object} data
 * @param {String} state
 * @returns {Object}
 */
function _getZipMap(data, state) {
  var zipMap = {};
  data.forEach(function(item) {
    // Only store the first entry for each zipcode, as there may be multiple
    // districts per zipcode. Matching by zipcode is not very accurate anyway
    // and we will warn the user in the UI.
    if (!zipMap[item.ZCTA]) {
      zipMap[item.ZCTA] = {
        district: item.CongressionalDistrict,
        state: state
      };
    }
  });

  return zipMap;
}

/**
 * Parses the csv file for a state and returns a zipcode map based on the data.
 *
 * @private
 * @param {String} state
 * @returns {Promise}
 */
function _getZipMapFromRawData(state) {
  return new Promise(function(resolve) {
    var filePath = 'data/congressional_districts_by_zipcode_raw/' + state.toLowerCase()  + '_data.csv';
    fs.readFile(filePath, 'utf8', function(err, data) {
      var parsedData = babyparse.parse(_getDataWithoutFirstLine(data), {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      }).data;

      resolve(_getZipMap(parsedData, state));
    });
  });
};

/**
 * Download the raw census zipcode to congressional district data.
 *
 * @private
 * @param {String} state
 * @returns {Promise}
 */
function _getDataForState(state) {
  return new Promise(function(resolve) {
    request(urls[state], function (error, response, body) {
      if (error) {
        console.log(error);
      } else if (response.statusCode == 200) {
        resolve({
          data: body,
          state: state
        });
      }
    });
  });
}

/**
 * Skips the first line of the CSV file because it's essentially a comment
 * that's not useful for parsing the data.
 *
 * @private
 * @param {String} data
 * @returns {String}
 */
function _getDataWithoutFirstLine(data) {
  return data.split('\r\n').slice(1).join('\r\n');
}
