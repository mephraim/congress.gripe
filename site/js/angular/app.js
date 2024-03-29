require('angular').
  module('CongressApp', [require('angular-route')]).

  config(require('./config.js')).
  run(require('./run.js')).

  controller('HomeController',
    require('./controllers/home_controller.js')).
  controller('MemberController',
    require('./controllers/member_controller.js')).
  controller('SiteController',
    require('./controllers/site_controller.js')).
  controller('StateController',
    require('./controllers/state_controller.js')).

  directive('hangoutButton',
    require('./directives/hangout_button_directive.js')).
  directive('memberCard',
    require('./directives/member_card/directive.js')).
  directive('memberCardChips',
    require('./directives/member_card_chips/directive.js')).
  directive('memberCardContactItem',
    require('./directives/member_card_contact_item/directive.js')).

  service('CensusService',
    require('./services/census_service.js')).
  service('HangoutService',
    require('./services/hangout_service.js')).
  service('MembersStoreService',
    require('./services/members_store_service.js')).
  service('PartyInfoService',
    require('./services/party_info_service.js')).
  service('SearchService',
    require('./services/search_service.js')).
  service('SiteService',
    require('./services/site_service.js')).
  service('StateInfoService',
    require('./services/state_info_service.js')).
  service('UrlService',
    require('./services/url_service.js')).
  service('ZipcodeService',
    require('./services/zipcode_service.js'));
