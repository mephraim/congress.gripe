require('angular').
  module('CongressApp', []).

  controller('MembersController',
    require('./controllers/members_controller.js')).

  service('GovTrackService',
    require('./services/govtrack_service.js'));
