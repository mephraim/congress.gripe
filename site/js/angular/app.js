require('angular').
  module('CongressApp', [require('angular-route')]).

  config(require('./config.js')).
  run(require('./run.js')).

  controller('HomeController',
    require('./controllers/home_controller.js')).
  controller('MemberController',
    require('./controllers/member_controller.js')).

  directive('hangoutButton',
    require('./directives/hangout_button_directive.js')).
  directive('memberCard',
    require('./directives/member_card/directive.js')).

  service('CensusService',
    require('./services/census_service.js')).
  service('HangoutService',
    require('./services/hangout_service.js')).
  service('MembersStoreService',
    require('./services/members_store_service.js')).
  service('PartyInfoService',
    require('./services/party_info_service.js')).
  service('StateInfoService',
    require('./services/state_info_service.js'));
