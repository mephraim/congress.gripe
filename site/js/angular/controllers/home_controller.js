var ENTER_KEY_CODE = 13;

/**
 * @ngInject
 */
function HomeController($location, $scope, CensusService, HangoutService, MembersStoreService, PartyInfoService, StateInfoService, UrlService) {
  var self = this;
  self.$location = $location;
  self.$scope = $scope;

  self.CensusService = CensusService;
  self.HangoutService = HangoutService;
  self.MembersStoreService = MembersStoreService;
  self.PartyInfoService = PartyInfoService;
  self.StateInfoService = StateInfoService;
  self.UrlService = UrlService;

  self._initStartingQuery();
  self._initLocationUpdater();
}

/**
 * Returns the text for congressional district header.
 * @returns {String}
 */
HomeController.prototype.getCongressionalDistrictHeader = function() {
  if (!this.currentCongressionalDistrict) {
    return;
  }

  return [this.StateInfoService.getName(this.currentCongressionalDistrict.state),
          this.currentCongressionalDistrict.name].join(' ');
};

/**
 * Returns the url for the currently displayed district (if there is one).
 * @returns {String}
 */
HomeController.prototype.getDistrictUrl = function() {
  return this.currentCongressionalDistrict && this.UrlService.getDistrictUrl(
    this.currentCongressionalDistrict.state,
    this.currentCongressionalDistrict.number);
};

/**
 * Returns a class array for the loading indicator.
 *
 * @return {String[]}
 */
HomeController.prototype.getLoadingIndicatorClass = function() {
  if (this._searchInProgress) {
    return ['is-active'];
  }
};

/**
 * Get the number of members that have been found.
 * @returns {Number}
 */
HomeController.prototype.getMembersCount = function() {
  return this.hasSearchResults() && this.getSearchResults().length;
};

/**
 * Returns a name to display for the member.
 *
 * @param {Object} member
 * @returns {String}
 */
HomeController.prototype.getNameForMember = function(member) {
  return [(member.person.nickname || member.person.firstname),
          member.person.lastname].join(' ');
};

/**
 * Builds a url for the member's profile page.
 *
 * @param {Object} member
 * @returns {String}
 */
HomeController.prototype.getMemberUrl = function(member) {
  return member && this.UrlService.getMemberUrl(member);
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

  return this.StateInfoService.getName(this.currentSearch.trim());
};

/**
 * Returns a class to be used with the state icon.
 * @returns {String}
 */
HomeController.prototype.getStateIconClass = function() {
  if (this.currentCongressionalDistrict) {
    return this.StateInfoService.getFontClass(this.currentCongressionalDistrict.state);
  }

  return this.currentSearch &&
         this.StateInfoService.getFontClass(this.currentSearch);
};

/**
 * Returns a url for the currently displayed state (if there is one).
 * @returns {String}
 */
HomeController.prototype.getStateUrl = function() {
  return this.isCurrentSearchForState() &&
         this.UrlService.getStateUrl(
           this.StateInfoService.getName(this.currentSearch.trim()));
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

  // If it looks like the user was searching for a state, take the user to the
  // state page if they hit enter.
  if (this.isCurrentSearchForState()) {
    this.$location.url(this.getStateUrl());
  } else {
    this.$location.url(this.UrlService.getMemberUrl(this.getSearchResults()[0]));
  }
};

/**
 * Are there search results to display?
 * @returns {Boolean}
 */
HomeController.prototype.hasSearchResults = function() {
  return this.getSearchResults().length > 0;
};

/**
 * Is the user searching for a state?
 * @returns {Boolean}
 */
HomeController.prototype.isCurrentSearchForState = function() {
  return this.currentSearch &&
         this.StateInfoService.isState(this.currentSearch.trim());
};

/**
 * Performs a search based on the current search term.
 */
HomeController.prototype.search = function() {
  var self = this;
  if (!this._hasCurrentSearch()) {
    delete self._searchResults;
    return;
  }

  if (self.MembersStoreService.isValidNameSearch(self.currentSearch)) {
    self.MembersStoreService.search(self.currentSearch).then(function(members) {
      self._searchResults = members;
    });
  }

  if (self.MembersStoreService.isValidAddressSearch(self.currentSearch)) {
    self._searchInProgress = true;
    self.CensusService.getCongressionalDistrict(self.currentSearch).then(function(response) {
      self._searchInProgress = false;

      if (response) {
        self.currentCongressionalDistrict = response;
        self.MembersStoreService.findAllForDistrict(response.state, response.number).then(function(members) {
          self._searchResults = members;
        });
      } else {
        delete self.currentCongressionalDistrict;
      }
    });
  }
};

/**
 * Is there a search term in the search box?
 * @returns {Boolean}
 */
HomeController.prototype._hasCurrentSearch = function() {
  return this.currentSearch && this.currentSearch.trim().length > 0;
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
