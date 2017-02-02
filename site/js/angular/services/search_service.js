var _ = require('underscore');

var MIN_ADDRESS_SEARCH_LENGTH = 3;
var MAX_NAME_SEARCH_LENGTH = 4;

/**
 * @ngInject
 */
function SearchService($q, CensusService, MembersStoreService, StateInfoService) {
  return {
    isValidAddressSearch: isValidAddressSearch,
    isValidNameSearch: isValidNameSearch,
    isValidStateSearch: isValidStateSearch,
    search: search
  };

  /**
   * Search for the term.
   *
   * @param {String} query
   * @returns {Promise}
   */
  function search(query) {
    return $q(function(resolve, reject) {
      if (isValidNameSearch(query)) {
        MembersStoreService.search(query).then(function(members) {
          resolve({
            members: members
          });
        });
      }
      else if (isValidAddressSearch(query)) {
        searchByAddress(query).then(resolve, reject);
      }
    });
  }

  /**
   * Search for an address.
   *
   * @param {String} query
   * @returns {Promise}
   */
  function searchByAddress(query) {
    return $q(function(resolve, reject) {
      CensusService.getCongressionalDistrict(query).then(function(district) {
        MembersStoreService.findAllForDistrict(district.state, district.number).then(function(members) {
          resolve({
            district: district,
            members: members
          });
        });
      }, function() {
        reject();
      });
    });
  }

  /**
   * Can this query be used to search for an address?
   * The Geolocation API requires a minimum number of words to successfully search
   * for an address.
   *
   * @param {String} query
   * @returns {Boolean}
   */
  function isValidAddressSearch(query) {
    return query &&
          !_.isEmpty(query.trim()) &&
          query.trim().split(' ').length >= MIN_ADDRESS_SEARCH_LENGTH;
  }

  /**
   * Can this query be used to search for a name?
   *
   * Some search strings are going to be very slow to search using the Fuse library
   * so restrict the length of names that will be searched using it.
   * @param {String} query
   * @returns {Boolean}
   */
  function isValidNameSearch(query) {
    return query &&
          !_.isEmpty(query.trim()) &&
          query.trim().split(' ').length <= MAX_NAME_SEARCH_LENGTH;
  }

  /**
   * Can this query be used to search for a state?
   *
   * @param {String} query
   * @returns {Boolean}
   */
  function isValidStateSearch(query) {
    return query &&
           !_.isEmpty(query.trim()) &&
           StateInfoService.isState(query);
  }
}

module.exports = SearchService;
