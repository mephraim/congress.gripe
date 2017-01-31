var _ = require('underscore');

/**
 * @ngInject
 */
function MemberCardDirectiveController(UrlService) {
  this.UrlService = UrlService;
}

/**
 * Get the member's full name.
 * @return {String}
 */
MemberCardDirectiveController.prototype.getMemberName = function() {
  return this.member() &&
         [this.member().person.nickname || this.member().person.firstname,
         this.member().person.lastname].join(' ');
};

/**
 * Gets the url for a member's phone number.
 * @returns {String}
 */
MemberCardDirectiveController.prototype.getPhoneUrl = function() {
  return this.member() &&
         this.member().phone &&
         this.UrlService.getPhoneUrl(this.member().phone);
};

/**
 * Returns a link to the user's YouTube account (if they have one).
 * @returns {String}
 */
MemberCardDirectiveController.prototype.getYouTubeUrl = function() {
  return this.member() &&
         this.member().person.youtubeid &&
         this.UrlService.getYouTubeUrl(this.member().person.youtubeid);
};

/**
 * Does this member have any contact items to show?
 * @returns {Boolean}
 */
MemberCardDirectiveController.prototype.hasContactItems = function() {
  if (!this.member()) {
    return false;
  }

  return _.some([
    this.member().phone,
    this.member().extra && this.member().extra.contact_form,
    this.member().website,
    this.getYouTubeUrl()
  ]);
};

module.exports = MemberCardDirectiveController;
