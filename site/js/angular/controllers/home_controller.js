var _ = require('underscore');

var ENTER_KEY_CODE = 13;
var ESC_KEY_CODE = 27;

var EXAMPLE_SEARCHES = [
  'Mitch McConnell',
  'Paul Ryan',
  'Ted Cruz'
];

/**
 * @ngInject
 */
function HomeController(
  $document,
  $location,
  $scope,
  $timeout,
  HangoutService,
  PartyInfoService,
  SearchService,
  StateInfoService,
  SiteService,
  UrlService) {

  var self = this;
  self.$location = $location;
  self.$scope = $scope;
  self.$timeout = $timeout;

  self.HangoutService = HangoutService;
  self.PartyInfoService = PartyInfoService;
  self.SearchService = SearchService;
  self.SiteService = SiteService;
  self.StateInfoService = StateInfoService;
  self.UrlService = UrlService;

  self._searchBoxElement =
    $document[0].querySelector('.search-card__search-box');

  self.updateSearchFromUrl();
  self._initLocationUpdater();
  self._initLocationWatcher();
  self._initHeaderUpdater();

  self.exampleSearch = self._getExampleSearch();

  $timeout(function() {
    self._searchBoxElement.focus();
  });
}

/**
 * Clear the search results.
 */
HomeController.prototype.clearResults = function() {
  delete this.currentSearch;
  delete this.currentCongressionalDistrict;
  delete this._searchResults;

  this._searchBoxElement.focus();
};

/**
 * Returns the text for congressional district header.
 * @returns {String}
 */
HomeController.prototype.getCongressionalDistrictHeader = function() {
  if (!this.currentCongressionalDistrict) {
    return;
  }

  var headerParts = [this.StateInfoService.getName(this.currentCongressionalDistrict.state)];

  // Some states only have one congresional district and therefore won't have a
  // district number. Leave the number part out of the header for these states.
  if (this.currentCongressionalDistrict.number) {
    headerParts.push('Congressional District');
    headerParts.push(this.currentCongressionalDistrict.number);
  }

  return headerParts.join(' ');
};

/**
 * Returns the url for the currently displayed district (if there is one).
 * @returns {String}
 */
HomeController.prototype.getDistrictUrl = function() {
  if (!this.currentCongressionalDistrict) {
    return;
  }

  if (this.currentCongressionalDistrict.number) {
    return this.UrlService.getDistrictUrl(
             this.currentCongressionalDistrict.state,
             this.currentCongressionalDistrict.number);
  }

  // If a congressional district doesn't have a number specified, just return the
  // url for the state.
  return this.UrlService.getStateUrl(
           this.StateInfoService.getName(this.currentCongressionalDistrict.state));
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
  if (this._hasCurrentSearch()) {
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
  this.clearResults();
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
 * Handles keyup events in the search box.
 *
 * @listens Event
 * @param {Event} $event
 */
HomeController.prototype.handleSearchKeyup = function($event) {
  if ($event.keyCode == ESC_KEY_CODE) {
    this.clearResults();
    return;
  }

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
 * Are there search results to display?
 * @returns {Boolean}
 */
HomeController.prototype.hasSearchResults = function() {
  return this.getSearchResults().length > 0;
};


/**
 * Should the clear button be visible?
 * @returns {Boolean}
 */
HomeController.prototype.isClearButttonVisible = function() {
  return !this._searchInProgress && this._hasCurrentSearch();
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
 * Should the help box be visible?
 * @returns {Boolean}
 */
HomeController.prototype.isHelpVisible = function() {
  return !this._hasCurrentSearch();
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
 * Should the search header box be visible?
 * @returns {Boolean}
 */
HomeController.prototype.isSearchHeaderVisible = function() {
  return !this._hasCurrentSearch();
};

/**
 * Should the header for a slow search be displayed?
 * @returns {Boolean}
 */
HomeController.prototype.isSlowSearchHeaderVisible = function() {
  return this._searchInProgress &&
         !this._verySlowSearchInProgress &&
         this._slowSearchInProgress;
};

/**
 * Should the header for a very slow search be displayed?
 * @returns {Boolean}
 */
HomeController.prototype.isVerySlowSearchHeaderVisible = function() {
  return this._searchInProgress && this._verySlowSearchInProgress;
};

/**
 * Should the zipcode footer be visible?
 * @returns {Boolean}
 */
HomeController.prototype.isZipcodeFooterVisible = function() {
  return this._hasCurrentSearch() &&
         this.hasSearchResults() &&
         this.SearchService.isValidZipcodeSearch(this.currentSearch.trim());
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

  self._searchInProgress = true;
  self.SearchService.search(self.currentSearch).then(function(result) {
    if (result.district) {
      self.currentCongressionalDistrict = result.district;
    }

    self._searchResults = result.members;
  // If the search fails, clear the current district and results
  }, function() {
    delete self._searchResults;
    delete self.currentCongressionalDistrict;
  // If the notify callback is called, it means the search is going to take a little more
  // time to complete, so display an extra warning if the search is still going.
  }, function(isVerySlow) {
    if (self._searchInProgress) {
      if (isVerySlow) {
        self._verySlowSearchInProgress = true;
      } else {
        self._slowSearchInProgress = true;
      }
    }
  }).finally(function() {
    self._searchInProgress = false;
    self._slowSearchInProgress = false;
    self._verySlowSearchInProgress = false;
  });
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
 * Gets a random example search to display.
 * @returns {String}
 */
HomeController.prototype._getExampleSearch = function() {
  return _.sample(EXAMPLE_SEARCHES);
};

/**
 * Is there a search term in the search box?
 * @private
 * @returns {Boolean}
 */
HomeController.prototype._hasCurrentSearch = function() {
  return !!(this.currentSearch &&
            this.currentSearch.trim().length > 0);
};

/**
 * Initializes a watcher that will hide/show the global site header.
 * @private
 */
HomeController.prototype._initHeaderUpdater = function() {
  var self = this;
  self.$scope.$watch(function() {
    return self._hasCurrentSearch();
  }, function() {
    self.SiteService.setSiteHeaderVisibility(
      self._hasCurrentSearch());
  });
};

/**
 * Initializes location updated watcher.
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

/**
 * Initializes a watcher that will clear the search results if there isn't a
 * query in url.
 */
HomeController.prototype._initLocationWatcher = function() {
  var self = this;
  self.$scope.$watch(function() {
    return self.$location.search();
  }, function() {
    if (_.keys(self.$location.search()).length < 1) {
      self.clearResults();
      self.currentSearch = null;
    }
  }, true);
};

module.exports = HomeController;
