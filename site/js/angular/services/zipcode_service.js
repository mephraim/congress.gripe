/**
 * @ngInject
 */
function ZipcodeService($http, $q) {
  var zipcodeData;

  var zipcodeDataPromise = $http.get('/data/congressional_districts_by_zipcode.json');
  zipcodeDataPromise.then(function(response) {
    zipcodeData = response.data;
  });

  return {
    getDistrictDataForZipcode: getDistrictDataForZipcode
  }

  /**
   * Get the state and district # (if there is one) for the zipcode.
   *
   * @param {String|Number} zipcode
   * @returns {Promise}
   */
  function getDistrictDataForZipcode(zipcode) {
    return $q(function(resolve, reject) {
      zipcodeDataPromise.then(function() {
        var data = zipcodeData[zipcode.toString().trim()];
        if (data) {
          resolve(data);
        } else {
          reject();
        }
      });
    });
  }
}

module.exports = ZipcodeService;
