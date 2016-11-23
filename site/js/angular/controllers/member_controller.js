/**
 * @ngInject
 */
function MemberController($routeParams, MembersStoreService) {
  var self = this;
  MembersStoreService.findById(parseInt($routeParams.memberId)).then(function(member) {
    self.member = member;
  });
}

module.exports = MemberController;
