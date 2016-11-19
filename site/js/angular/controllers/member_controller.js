/**
 * @ngInject
 */
function MemberController($routeParams, MembersStoreService, PartyInfoService) {
  var self = this;
  self.PartyInfoService = PartyInfoService;

  MembersStoreService.findById(parseInt($routeParams.memberId)).then(function(member) {
    self.member = member;
  });
}

MemberController.prototype.getPartyChipClass = function() {
  if (this.member) {
    return this.PartyInfoService.getPartyBackgroundColorForMember(this.member);
  }
};

MemberController.prototype.getPartyChipParty = function() {
  if (this.member) {
    return this.PartyInfoService.getPartyAbbreviationForMember(this.member);
  }
};

module.exports = MemberController;
