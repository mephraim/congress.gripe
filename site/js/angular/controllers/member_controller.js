/**
 * @ngInject
 */
function MemberController($routeParams, MembersStoreService, PartyInfoService, StateInfoService) {
  var self = this;
  self.PartyInfoService = PartyInfoService;
  self.StateInfoService = StateInfoService;

  MembersStoreService.findById(parseInt($routeParams.memberId)).then(function(member) {
    self.member = member;
  });
}

/**
 * Should the state chip be displayed?
 * @returns {Boolean}
 */
MemberController.prototype.isStateChipVisible = function() {
  return this.member &&
         this.member.customData.fullStateName;
};

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
  return this.member &&
         this.PartyInfoService.getPartyBackgroundColorForMember(this.member);
};

/**
 * Returns a single letter abbreviation for the member's party.
 * @returns {String}
 */
MemberController.prototype.getPartyChipParty = function() {
  return this.member &&
         this.PartyInfoService.getPartyAbbreviationForMember(this.member);
};

/**
 * Returns a class that will be used for the state icon.
 * @returns {String}
 */
MemberController.prototype.getStateChipIconClass = function() {
  return this.member &&
         this.member.customData.fullStateName &&
         this.StateInfoService.getFontClass(this.member.customData.fullStateName);
};

module.exports = MemberController;
