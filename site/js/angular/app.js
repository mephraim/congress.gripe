require('angular').
  module('CongressApp', [require('angular-route')]).

  config(require('./config.js')).

  controller('HomeController',
    require('./controllers/home_controller.js')).
  controller('MemberController',
    require('./controllers/member_controller.js')).

  directive('hangoutButton',
    require('./directives/hangout_button_directive.js')).

  service('HangoutService',
    require('./services/hangout_service.js')).
  service('MembersStoreService',
    require('./services/members_store_service.js')).
  service('PartyInfoService',
    require('./services/party_info_service.js'));
