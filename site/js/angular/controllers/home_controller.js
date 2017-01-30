var ENTER_KEY_CODE = 13;

/**
 * @ngInject
 */
function HomeController(
  $document,
  $location,
  $scope,
  $timeout,
  CensusService,
  HangoutService,
  MembersStoreService,
  PartyInfoService,
  StateInfoService,
  UrlService) {

  var self = this;
  self.$location = $location;
  self.$scope = $scope;
  self.$timeout = $timeout;

  self.CensusService = CensusService;
  self.HangoutService = HangoutService;
  self.MembersStoreService = MembersStoreService;
  self.PartyInfoService = PartyInfoService;
  self.StateInfoService = StateInfoService;
  self.UrlService = UrlService;

  self._searchBoxElement =
    $document[0].querySelector('.search-card__search-box');

  self.updateSearchFromUrl();
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
 * Handles the search clear button.
 */
HomeController.prototype.handleClearButtonClick = function() {
  delete this.currentSearch;
  delete this.currentCongressionalDistrict;
  delete this._searchResults;

  this._searchBoxElement.focus();
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
  // If a congressional district has loaded, take the user to the congressional district
  // page when they hit enter.
  } else if (this.currentCongressionalDistrict) {
    this.$location.url(this.getDistrictUrl());
  // Otherwise, go to the page for the first search result
  } else {
    this.$location.url(this.UrlService.getMemberUrl(this.getSearchResults()[0]));
  }
};

/**
 * Should the clear button be visible?
 * @returns {Boolean}
 */
HomeController.prototype.isClearButttonVisible = function() {
  return !this._searchInProgress && this._hasCurrentSearch();
};

/**
 * Should the "No results" box be visible?
 * @returns {Boolean}
 */
HomeController.prototype.isNoResultsVisible = function() {
  return !this._searchInProgress &&
          this._hasCurrentSearch() &&
         !this.hasSearchResults();
};

/**
 * Should the help box be visible?
 * @returns {Boolean}
 */
HomeController.prototype.isHelpVisible = function() {
  return !this._hasCurrentSearch();
};

/**
 * Handles a link to a search.
 *
 * NOTE: there's probably a way to just gracefully handle links to `?` links on
 * the homepage, but I haven't found it yet.
 */
HomeController.prototype.handleSearchLink = function() {
  var self = this;
  self.$timeout(function() {
    self.updateSearchFromUrl();
  });
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

  delete this.currentCongressionalDistrict;

  if (self.MembersStoreService.isValidNameSearch(self.currentSearch)) {
    self.MembersStoreService.search(self.currentSearch).then(function(members) {
      self._searchResults = members;
    });
  }

  if (self.MembersStoreService.isValidAddressSearch(self.currentSearch)) {
    self._searchInProgress = true;
    self.CensusService.getCongressionalDistrict(self.currentSearch).then(function(response) {
      self.currentCongressionalDistrict = response;
      self.MembersStoreService.findAllForDistrict(response.state, response.number).then(function(members) {
        self._searchResults = members;
      });
    }, function() {
      delete self.currentCongressionalDistrict;
    }).finally(function() {
      self._searchInProgress = false;
    });
  }
};

/**
 * Update the searchbox with the search string from the url.
 */
HomeController.prototype.updateSearchFromUrl = function() {
  var query = this.$location.search().q;
  if (query) {
    this.currentSearch = query;
    this.search();
  }
};

/**
 * Is there a search term in the search box?
 * @private
 * @returns {Boolean}
 */
HomeController.prototype._hasCurrentSearch = function() {
  return this.currentSearch && this.currentSearch.trim().length > 0;
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
