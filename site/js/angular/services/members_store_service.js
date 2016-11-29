var MembersStore = require('../../lib/members_store.js');

/**
 * Wrapper for the members store. This will create a single MembersStore
 * instance that can be used across the app.
 *
 * @ngInject
 */
function MembersStoreService($http, $q) {
  var store;

  // Make request for congress members JSON data as soon as the app loads.
  // Store the HTTP promise for the data so that it can be used in `getJSON`.
  var congressMembersHttpPromise = $http.get('/data/congress_members.json');
  congressMembersHttpPromise.then(function(response) {
    store = new MembersStore(response.data);
  });

  return {
    ROLE_TYPE_REPRESENTATIVE: MembersStore.ROLE_TYPE_REPRESENTATIVE,
    ROLE_TYPE_SENATOR: MembersStore.ROLE_TYPE_SENATOR,

    findById: findById,
    findAllForState: findAllForState,
    findAllForDistrict: findAllForDistrict,
    findRepresentativeForDistrict: findRepresentativeForDistrict,
    isValidAddressSearch: isValidAddressSearch,
    isValidNameSearch: isValidNameSearch,
    search: search
  };

  /**
   * Find a member by their govtrack ID.
   *
   * @param {Number} id
   * @returns {Promise}
   */
  function findById(id) {
    return $q(function(resolve) {
      getStore().then(function(store) {
        resolve(store.findById(id));
      });
    });
  }

  /**
   * Find all senators or representatives for a state
   *
   * @param {String} state
   * @param {String?} roleType
   * @returns {Promise}
   */
  function findAllForState(state, roleType) {
    return $q(function(resolve, reject) {
      getStore().then(function(store) {
        resolve(store.findAllForState(state, roleType));
      });
    });
  }

  /**
   * Find the senators and representatives for a district.
   *
   * @param {String} state
   * @param {Number} district
   * @returns {Promise}
   */
  function findAllForDistrict(state, district) {
    return $q(function(resolve, reject) {
      getStore().then(function(store) {
        resolve(store.findAllForDistrict(state, district));
      });
    });
  }

  /**
   * Find the representative for a specific district.
   *
   * @param {String} state
   * @param {Number} district
   * @returns {Promise}
   */
  function findRepresentativeForDistrict(state, district) {
    return $q(function(resolve, reject) {
      getStore().then(function(store) {
        resolve(store.findRepresentativeForDistrict(state, district));
      });
    });
  }

  /**
   * Wrapper function for getting the initialized members store instance.
   *
   * If any of the service methods are called before the JSON file has fully
   * loaded, this will guarantee that the methods eventually resolve when the
   * JSON file loads.
   */
  function getStore() {
    return $q(function(resolve) {
      congressMembersHttpPromise.then(function() {
        resolve(store);
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
    return MembersStore.isValidAddressSearch(query);
  }

  /**
   * Can this query be used to search for a name?
   *
   * Some search strings are going to be very slow to search using the Fuse library
   * so restrict the length of names that will be searched using it.
   *
   * @param {String} query
   * @returns {Boolean}
   */
  function isValidNameSearch(query) {
    return MembersStore.isValidNameSearch(query);
  }

  /**
   * Search for a member for congress.
   *
   * @param {String} query
   * @returns {Promise}
   */
  function search(query) {
    return $q(function(resolve, reject) {
      getStore().then(function(store) {
        resolve(store.search(query));
      });
    });
  }
}

module.exports = MembersStoreService;
