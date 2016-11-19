var MembersStore = require('../../lib/members_store.js');

/**
 * @ngInject
 */
function MembersStoreService($http) {
  var store;
  $http.get('/data/congress_members.json').then(function(response) {
    store = new MembersStore(response.data);
  });

  return {
    search: function(query) {
      return store.search(query);
    }
  };
}

module.exports = MembersStoreService;
