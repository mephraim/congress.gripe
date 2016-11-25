var MembersStore = require('../../lib/members_store.js');

/**
 * Wrapper for the members store. This will create a single MembersStore
 * instance that can be used across the app.
 *
 * @ngInject
 */
function MembersStoreService($http, $q) {
  var store;
  var httpPromise = $http.get('/data/congress_members.json');
  httpPromise.then(function(response) {
    store = new MembersStore(response.data);
  });

  return {
    ROLE_TYPE_REPRESENTATIVE: MembersStore.ROLE_TYPE_REPRESENTATIVE,
    ROLE_TYPE_SENATOR: MembersStore.ROLE_TYPE_SENATOR,

    /**
     * Find a member by their govtrack ID.
     *
     * @param {Number} id
     * @returns {Promise}
     */
    findById: function(id) {
      return $q(function(resolve, reject) {
        if (store) {
          resolve(store.findById(id));
        } else {
          httpPromise.then(function() {
            resolve(store.findById(id));
          });
        }
      });
    },

    /**
     * Find all senators or representatives for a state
     *
     * @param {String} state
     * @param {String?} roleType
     * @returns {Promise}
     */
    findAllForState: function(state, roleType) {
      return $q(function(resolve, reject) {
        if (store) {
          resolve(store.findAllForState(state, roleType));
        } else {
          httpPromise.then(function() {
            resolve(store.findAllForState(state, roleType));
          });
        }
      });
    },

    /**
     * Find the senators and representatives for a district.
     *
     * @param {String} state
     * @param {Number} district
     * @returns {Promise}
     */
    findAllForDistrict: function(state, district) {
      return $q(function(resolve, reject) {
        if (store) {
          resolve(store.findAllForDistrict(state, district));
        } else {
          httpPromise.then(function() {
            resolve(store.findAllForDistrict(state, district));
          });
        }
      });
    },

    /**
     * Find the representative for a specific district.
     *
     * @param {String} state
     * @param {Number} district
     * @returns {Promise}
     */
    findRepresentativeForDistrict: function(state, district) {
      return $q(function(resolve, reject) {
        if (store) {
          resolve(store.findRepresentativeForDistrict(state, district));
        } else {
          httpPromise.then(function() {
            resolve(store.findRepresentativeForDistrict(state, district));
          });
        }
      });
    },

    /**
     * Can this query be used to search for an address?
     * The Geolocation API requires a minimum number of words to successfully search
     * for an address.
     *
     * @param {String} query
     * @returns {Boolean}
     */
    isValidAddressSearch: function(query) {
      return MembersStore.isValidAddressSearch(query);
    },

    /**
     * Can this query be used to search for a name?
     *
     * Some search strings are going to be very slow to search using the Fuse library
     * so restrict the length of names that will be searched using it.
     *
     * @param {String} query
     * @returns {Boolean}
     */
    isValidNameSearch: function(query) {
      return MembersStore.isValidNameSearch(query);
    },

    /**
     * Search for a member for congress.
     *
     * @param {String} query
     * @returns {Promise}
     */
    search: function(query) {
      return $q(function(resolve, reject) {
        if (store) {
          resolve(store.search(query));
        } else {
          httpPromise.then(function() {
            resolve(store.search(query));
          });
        }
      });
    }
  };
}

module.exports = MembersStoreService;
