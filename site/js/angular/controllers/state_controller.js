/**
 * @ngInject
 */
function StateController($routeParams, MembersStoreService, StateInfoService) {
  var self = this;
  self.StateInfoService = StateInfoService;
  self.stateName = $routeParams.name.toLowerCase();

  MembersStoreService.findAllForState(
    self.stateName, MembersStoreService.ROLE_TYPE_SENATOR).then(function(senators) {
    self.senators = senators;
  });

  MembersStoreService.findAllForState(
    self.stateName, MembersStoreService.ROLE_TYPE_REPRESENTATIVE).then(function(representatives) {
    self.representatives = representatives;
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
