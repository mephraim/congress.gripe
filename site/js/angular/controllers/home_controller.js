var ENTER_KEY_CODE = 13;
var MEMBER_URL_TEMPLATE = '/members/{{name}}/{{id}}';

/**
 * @ngInject
 */
function HomeController($interpolate, $http, $location, $scope, HangoutService, MembersStoreService, PartyInfoService, StateInfoService) {
  var self = this;
  self.$http = $http;
  self.$interpolate = $interpolate;
  self.$location = $location;
  self.$scope = $scope;

  self.HangoutService = HangoutService;
  self.MembersStoreService = MembersStoreService;
  self.PartyInfoService = PartyInfoService;
  self.StateInfoService = StateInfoService;

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
  if (this.hasSearchResults()) {
    return ['collapsed'];
  }
};

/**
 * Handles keyup events in the search box.
 *
 * @listens Event
 * @param {Event} $event
 */
HomeController.prototype.handleSearchKeyup = function($event) {
  if ($event.keyCode != ENTER_KEY_CODE || !this.hasSearchResults()) {
    return;
  }

  this.$location.url(this.getUrlForMember(this.getSearchResults()[0]));
};

/**
 * Are there search results to display?
 * @returns {Boolean}
 */
HomeController.prototype.hasSearchResults = function() {
  return this.getSearchResults().length > 0;
};

/**
 * Returns the current list of search results.
 * @returns {Object[]}
 */
HomeController.prototype.getSearchResults = function() {
  return this._searchResults || [];
};

/**
 * Returns a state name that should be displayed in the state header.
 */
HomeController.prototype.getStateForStateHeader = function() {
  if (!this.currentSearch) {
    return;
  }

  if (this.StateInfoService.isStateAbbreviation(this.currentSearch)) {
    return this.StateInfoService.getName(this.currentSearch);
  }

  return this.currentSearch.charAt(0).toUpperCase() + this.currentSearch.slice(1);
};

/**
 * Returns a class to be used with the state icon.
 * @returns {String}
 */
HomeController.prototype.getStateIconClass = function() {
  return this.currentSearch && this.StateInfoService.getFontClass(this.currentSearch);
};

/**
 * Is the user searching for a state?
 * @returns {Boolean}
 */
HomeController.prototype.isCurrentSearchForState = function() {
  return this.currentSearch && this.StateInfoService.isState(this.currentSearch);
};

/**
 * Performs a search based on the current search term.
 */
HomeController.prototype.search = function() {
  var self = this;
  self.MembersStoreService.search(this.currentSearch).then(function(members) {
    self._searchResults = members;
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
