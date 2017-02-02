var _ = require('underscore');

var MAX_NAME_SEARCH_LENGTH = 4;
var MAX_ZIPCODE_LENGTH = 5;
var MIN_ADDRESS_SEARCH_LENGTH = 3;
var MIN_ZIPCODE_LENGTH = 3;
var SLOW_SEARCH_TIMEOUT_MS = 2000;
var ZIPCODE_REGEX = /^\d+$/;

/**
 * @ngInject
 */
function SearchService($q, $timeout, CensusService, MembersStoreService, StateInfoService, ZipcodeService) {
  return {
    isValidAddressSearch: isValidAddressSearch,
    isValidNameSearch: isValidNameSearch,
    isValidStateSearch: isValidStateSearch,
    isValidZipcodeSearch: isValidZipcodeSearch,
    search: search,
    searchByAddress: searchByAddress,
    searchByZipcode: searchByZipcode
  };

  /**
   * Search for the term.
   *
   * @param {String} query
   * @returns {Promise}
   */
  function search(query) {
    // Use deferred instead of the $q shorthand method because we need to call
    // the `notify` method for slow searches.
    var deferred = $q.defer();

    if (isValidZipcodeSearch(query)) {
      searchByZipcode(query).then(deferred.resolve, deferred.reject);
    } else if (isValidNameSearch(query)) {
      MembersStoreService.search(query).then(function(members) {
        deferred.resolve({
          members: members
        });
      });
    }
    else if (isValidAddressSearch(query)) {
      // Searching by address will take longer than other types of searches,
      // so notify the caller that some kind of status should be displayed.
      var slowTimeout = $timeout(function() {
        deferred.notify();
      }, SLOW_SEARCH_TIMEOUT_MS);

      searchByAddress(query).then(function(data) {
        deferred.resolve(data);
      }, function() {
        deferred.reject();
      }, function() {
        $timeout.cancel(slowTimeout);
      });
    } else {
      deferred.reject();
    }

    return deferred.promise;
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
   * Search for all of the representatives in a zipcode.
   *
   * @param {String} query
   * @returns {Promise}
   */
  function searchByZipcode(query) {
    return $q(function(resolve, reject) {
      ZipcodeService.getDistrictDataForZipcode(query).then(function(data) {
        MembersStoreService.findAllForDistrict(data.state, data.district).then(function(members) {
          resolve({
            district: {
              number: data.district,
              state: data.state
            },
            members: members
          });
        }, reject);
      }, reject);
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

  /**
   * Can this query be used to search for a zipcode?
   *
   * @param {String} query
   * @returns {Boolean}
   */
  function isValidZipcodeSearch(query) {
    return query &&
           !_.isEmpty(query.toString().trim()) &&
           query.toString().trim().length >= MIN_ZIPCODE_LENGTH &&
           query.toString().trim().length <= MAX_ZIPCODE_LENGTH &&
           ZIPCODE_REGEX.test(query.toString().trim()) &&
           !!parseInt(query, 10);
  }
}

module.exports = SearchService;
