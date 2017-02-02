var _ = require('underscore');

/**
 * A service for querying the Census geocoder.
 * Documenation here: https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.pdf
 * Layer codes here: https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer
 *
 * @ngInject
 */
function CensusService($http, $httpParamSerializer, $q) {
  var GEOGRAPHIES_URL = 'http://geocoding.geo.census.gov/geocoder/geographies/onelineaddress';
  var LAYER_CODE_CONGRESSIONAL_DISTRICTS = 54;
  var LAYER_KEY_CONGRESSIONAL_DISTRICTS = '115th Congressional Districts';

  var _getGeographyDataDebounced = _.debounce(_getGeographyData, 500);

  return {
    getCongressionalDistrict: getCongressionalDistrict,
    getGeographyForAddress: getGeographyForAddress
  };

  /**
   * Get the geography information for a given address.
   *
   * @param {String} address
   * @returns {Promise}
   */
  function getGeographyForAddress(address) {
    return $q(function(resolve, reject) {
      _getGeographyDataDebounced(address, resolve, reject);
    });
  }

  /**
   * Get the congressional district for a given address.
   *
   * @param {String} address
   * @returns {Promise}
   */
  function getCongressionalDistrict(address) {
    return $q(function(resolve, reject) {
      getGeographyForAddress(address).then(function(addressData) {
        if (!addressData) {
          return reject();
        }

        var districtData = addressData.geographies[LAYER_KEY_CONGRESSIONAL_DISTRICTS][0];
        resolve({
          name: districtData.NAME,
          number: parseInt(districtData.BASENAME) || 0,
          state: addressData.addressComponents.state
        });
      });
    });
  }

  /**
   * Build a url for getting data from the Census geographies endpoint.
   *
   * @private
   * @param {String} address
   * @returns {String}
   */
  function _buildGetUrlForGeographies(address) {
    return GEOGRAPHIES_URL + '?' + $httpParamSerializer({
      address: address,

      // Use the most current data
      benchmark: 'Public_AR_Current',
      vintage: 'Current_Current',

      // Include the congressional district layer
      layers: LAYER_CODE_CONGRESSIONAL_DISTRICTS,
      format: 'jsonp'
    });
  }

  /**
   * Make a request to Census geographies endpoint for a given address.
   *
   * @private
   * @param {String}
   * @param {Function}
   * @param {Function}
   * @returns {Promise}
   */
  function _getGeographyData(address, resolve, reject) {
    $http.jsonp(_buildGetUrlForGeographies(address), {
      jsonpCallbackParam: 'callback'
    }).then(function(response) {
      if (response.data.result &&
          response.data.result.addressMatches &&
          response.data.result.addressMatches.length > 0) {
        resolve(response.data.result.addressMatches[0]);
      } else {
        resolve();
      }
    });
  }
}

module.exports = CensusService;
