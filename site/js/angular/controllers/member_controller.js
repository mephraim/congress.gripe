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

/**
 * Get the member's full name.
 * @return {String}
 */
MemberController.prototype.getMemberName = function() {
  if (this.member) {
    return this.member.person.firstname + ' ' + this.member.person.lastname;
  }
};

/**
 * Returns a background color class array for the member's party.
 * @returns {String[]}
 */
MemberController.prototype.getPartyChipClass = function() {
  if (this.member) {
    return this.PartyInfoService.getPartyBackgroundColorForMember(this.member);
  }
};

/**
 * Returns a single letter abbreviation for the member's party.
 * @returns {String}
 */
MemberController.prototype.getPartyChipParty = function() {
  if (this.member) {
    return this.PartyInfoService.getPartyAbbreviationForMember(this.member);
  }
};

module.exports = MemberController;
