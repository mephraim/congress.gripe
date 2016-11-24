/**
 * @ngInject
 */
function MemberCardDirectiveController(PartyInfoService, StateInfoService) {
  this.PartyInfoService = PartyInfoService;
  this.StateInfoService = StateInfoService;
}

/**
 * Should the state chip be displayed?
 * @returns {Boolean}
 */
MemberCardDirectiveController.prototype.isStateChipVisible = function() {
  return this.member() &&
         this.member().customData.fullStateName;
};

/**
 * Should the district chip be displayed?
 */
MemberCardDirectiveController.prototype.isDistrictChipVisible = function() {
  return this.member() && this.member().district;
};

/**
 * Get the member's full name.
 * @return {String}
 */
MemberCardDirectiveController.prototype.getMemberName = function() {
  if (this.member()) {
    return [this.member().person.nickname || this.member().person.firstname,
            this.member().person.lastname].join(' ');
  }
};

/**
 * Returns a background color class array for the member's party.
 * @returns {String[]}
 */
MemberCardDirectiveController.prototype.getPartyChipClass = function() {
  return this.member() &&
         this.PartyInfoService.getPartyBackgroundColorForMember(this.member());
};

/**
 * Returns a single letter abbreviation for the member's party.
 * @returns {String}
 */
MemberCardDirectiveController.prototype.getPartyChipParty = function() {
  return this.member() &&
         this.PartyInfoService.getPartyAbbreviationForMember(this.member());
};

/**
 * Returns a class that will be used for the state icon.
 * @returns {String}
 */
MemberCardDirectiveController.prototype.getStateChipIconClass = function() {
  return this.member() &&
         this.member().customData.fullStateName &&
         this.StateInfoService.getFontClass(this.member().customData.fullStateName);
};


module.exports = MemberCardDirectiveController;
