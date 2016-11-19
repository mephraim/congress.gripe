require('angular').
  module('CongressApp', [require('angular-route')]).

  config(require('./config.js')).

  controller('HomeController',
    require('./controllers/home_controller.js')).
  controller('MemberController',
    require('./controllers/member_controller.js')).

  service('HangoutService',
    require('./services/hangout_service.js')).
  service('MembersStoreService',
    require('./services/members_store_service.js'));
