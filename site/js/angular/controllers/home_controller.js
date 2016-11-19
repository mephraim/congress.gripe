/**
 * @ngInject
 */
function HomeController($http, $scope, $window, HangoutService, MembersStoreService, PartyInfoService) {
  var self = this;
  self.$http = $http;
  self.$window = $window;
  self.HangoutService = HangoutService;
  self.MembersStoreService = MembersStoreService;
  self.PartyInfoService = PartyInfoService;

  $scope.$watch(function() {
    return self.currentSearch;
  }, function(oldVal, newVal) {
    if (oldVal != newVal) {
      self._search();
    }
  });
}

HomeController.prototype.getPartyColorForMember = function(member) {
  return this.PartyInfoService.getPartyTextColorForMember(member);
};

HomeController.prototype.getSearchCardClass = function() {
  if (this.currentMembers && this.currentMembers.length > 0) {
    return ['collapsed'];
  }
};

HomeController.prototype.hasCurrentMembers = function() {
  return this.currentMembers && this.currentMembers.length > 0;
};

HomeController.prototype.showMore = function(member) {
  this.current = member;
  this.HangoutService.renderButton('hangout-placeholder', member.phone);
};

HomeController.prototype.closeMore = function() {
  this.current = null;
};

HomeController.prototype._search = function() {
  var self = this;
  self.MembersStoreService.search(this.currentSearch).then(function(members) {
    self.currentMembers = members;
  });
};

module.exports = HomeController;
