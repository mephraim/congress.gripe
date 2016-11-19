/**
 * @ngInject
 */
function GovTrackService($http, $httpParamSerializer) {
  var PERSON_URL = 'https://www.govtrack.us/api/v2/person';

  return {
    person: function(params) {
      return $http.get(_buildGetUrl(PERSON_URL, params));
    }
  };

  function _buildGetUrl(url, params) {
    return url + '?' + $httpParamSerializer(params);
  }
}

module.exports = GovTrackService;
