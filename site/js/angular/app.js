require('angular').
  module('CongressApp', []).

  controller('MembersController',
    require('./controllers/members_controller.js')).

  service('HangoutService',
    require('./services/hangout_service.js')).
  service('MembersStoreService',
    require('./services/members_store_service.js'));
