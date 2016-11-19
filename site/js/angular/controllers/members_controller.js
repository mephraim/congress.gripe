/**
 * @ngInject
 */
function MembersController($http, $scope, $window, HangoutService, MembersStoreService) {
  var self = this;
  self.$http = $http;
  self.$window = $window;
  self.HangoutService = HangoutService;
  self.MembersStoreService = MembersStoreService;

  $scope.$watch(function() {
    return self.currentSearch;
  }, function(oldVal, newVal) {
    if (oldVal != newVal) {
      self._search();
    }
  });
}

MembersController.prototype.getSearchBoxClass = function() {
  if (this.currentMembers && this.currentMembers.length > 0) {
    return ['collapsed'];
  }
};

MembersController.prototype.showMore = function(member) {
  this.current = member;
  this.HangoutService.renderButton('hangout-placeholder', member.phone);
};

MembersController.prototype.closeMore = function() {
  this.current = null;
};

MembersController.prototype._search = function() {
  this.currentMembers = this.MembersStoreService.search(this.currentSearch);
  console.log(this.currentMembers[0]);
};

module.exports = MembersController;