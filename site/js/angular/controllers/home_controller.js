var ENTER_KEY_CODE = 13;
var MEMBER_URL_TEMPLATE = '/members/{{name}}/{{id}}';

/**
 * @ngInject
 */
function HomeController($interpolate, $http, $location, $scope, HangoutService, MembersStoreService, PartyInfoService) {
  var self = this;
  self.$http = $http;
  self.$interpolate = $interpolate;
  self.$location = $location;
  self.$scope = $scope;

  self.HangoutService = HangoutService;
  self.MembersStoreService = MembersStoreService;
  self.PartyInfoService = PartyInfoService;

  self._initStartingQuery();
  self._initLocationUpdater();
}

/**
 * Builds a url for the member's profile page.
 *
 * @param {Object} member
 * @returns {String}
 */
HomeController.prototype.getUrlForMember = function(member) {
  return this.$interpolate(MEMBER_URL_TEMPLATE)({
    id: member.person.id,
    name: member.person.firstname + '+' + member.person.lastname
  });
};

/**
  * Returns a background color class array for the member's party.
  *
  * @param {Object} member
  * @returns {String[]}
  */
HomeController.prototype.getPartyColorForMember = function(member) {
  return this.PartyInfoService.getPartyTextColorForMember(member);
};

/**
 * Returns a class array for the wrapper search card.
 * @returns {String[]}
 */
HomeController.prototype.getSearchCardClass = function() {
  if (this.currentMembers && this.currentMembers.length > 0) {
    return ['collapsed'];
  }
};

/**
 * Is there a list of members being displayed?
 * @returns {Boolean}
 */
HomeController.prototype.hasCurrentMembers = function() {
  return this.currentMembers && this.currentMembers.length > 0;
};

/**
 * Handles keyup events in the search box.
 *
 * @listens Event
 * @param {Event} $event
 */
HomeController.prototype.handleSearchKeyup = function($event) {
  if ($event.keyCode != ENTER_KEY_CODE || !this.hasCurrentMembers()) {
    return;
  }

  this.$location.url(this.getUrlForMember(this.currentMembers[0]));
};

/**
 * Performs a search based on the current search term.
 */
HomeController.prototype.search = function() {
  var self = this;
  self.MembersStoreService.search(this.currentSearch).then(function(members) {
    self.currentMembers = members;
  });
};

/**
 * Initializes the starting search query (if there is one).
 * @private
 */
HomeController.prototype._initStartingQuery = function() {
  var query = this.$location.search().q;
  if (query) {
    this.currentSearch = query;
    this.search();
  }
};

/**
 * Initializes watchers.
 * @private
 */
HomeController.prototype._initLocationUpdater = function() {
  var self = this;
  self.$scope.$watch(function() {
    return self.currentSearch;
  }, function(oldVal, newVal) {
    if (oldVal == newVal) {
      return;
    }

    self.$location.search('q', self.currentSearch);
    self.$location.replace();
  });
};

module.exports = HomeController;
