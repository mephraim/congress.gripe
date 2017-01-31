/**
 * @ngInject
 */
function StateController($routeParams, $timeout, MembersStoreService, SiteService, StateInfoService) {
  var self = this;
  self.StateInfoService = StateInfoService;
  self.stateName = $routeParams.name.toLowerCase();
  self.district = $routeParams.district && parseInt($routeParams.district, 0);

  MembersStoreService.findAllForState(self.stateName, MembersStoreService.ROLE_TYPE_SENATOR).then(function(senators) {
    self.senators = senators;
  });

  var state = StateInfoService.getAbbreviation(self.stateName);
  if (self.district) {
    MembersStoreService.findRepresentativeForDistrict(state, self.district).then(function(representative) {
      self.representatives = [representative];
    });
  } else {
    MembersStoreService.findAllForState(state, MembersStoreService.ROLE_TYPE_REPRESENTATIVE).then(function(representatives) {
      self.representatives = representatives;
    });
  }

  $timeout(function() {
    SiteService.setSiteHeaderVisibility(true);
  });
}

/**
 * Returns a class to be used with the state icon.
 * @returns {String}
 */
StateController.prototype.getStateIconClass = function() {
  return this.StateInfoService.getFontClass(this.stateName);
};

/**
 * Returns the state name to use with headers.
 * @returns {String}
 */
StateController.prototype.getStateName = function() {
  return this.StateInfoService.getName(this.stateName);
};

module.exports = StateController;
