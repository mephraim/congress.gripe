/**
 * @ngInject
 */
function MemberCardChipsDirectiveController(PartyInfoService, StateInfoService, UrlService) {
  this.PartyInfoService = PartyInfoService;
  this.StateInfoService = StateInfoService;
  this.UrlService = UrlService;
}

/**
 * Returns an href for the district detail page.
 * @returns {String}
 */
MemberCardChipsDirectiveController.prototype.getDistrictUrl = function() {
  return this.member() &&
         this.UrlService.getDistrictUrl(
           this.member().customData.fullStateName, this.member().district);
};

/**
 * Returns a background color class array for the member's party.
 * @returns {String[]}
 */
MemberCardChipsDirectiveController.prototype.getPartyChipClass = function() {
  return this.member() &&
         this.PartyInfoService.getPartyBackgroundColorForMember(this.member());
};

/**
 * Returns a single letter abbreviation for the member's party.
 * @returns {String}
 */
MemberCardChipsDirectiveController.prototype.getPartyChipParty = function() {
  return this.member() &&
         this.PartyInfoService.getPartyAbbreviationForMember(this.member());
};

/**
 * Returns a class that will be used for the state icon.
 * @returns {String}
 */
MemberCardChipsDirectiveController.prototype.getStateChipIconClass = function() {
  return this.member() &&
         this.member().customData.fullStateName &&
         this.StateInfoService.getFontClass(this.member().customData.fullStateName);
};

/**
 * Returns an href to the state detail page.
 * @returns {String}
 */
MemberCardChipsDirectiveController.prototype.getStateUrl = function() {
  return this.member() &&
         this.UrlService.getStateUrl(this.member().customData.fullStateName);
};

/**
 * Should the district chip be displayed?
 */
MemberCardChipsDirectiveController.prototype.isDistrictChipVisible = function() {
  return this.member() && this.member().district;
};

/**
 * Should the state chip be displayed?
 * @returns {Boolean}
 */
MemberCardChipsDirectiveController.prototype.isStateChipVisible = function() {
  return this.member() &&
         this.member().customData.fullStateName;
};

module.exports = MemberCardChipsDirectiveController;
