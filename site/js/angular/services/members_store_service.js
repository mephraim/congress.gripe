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
