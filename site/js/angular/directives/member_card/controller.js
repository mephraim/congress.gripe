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
 * Returns a link to the user's YouTube account (if they have one).
 * @returns {String}
 */
MemberCardDirectiveController.prototype.getYouTubeUrl = function() {
  return this.member() &&
         this.member().person.youtubeid &&
         this.UrlService.getYouTubeUrl(this.member().person.youtubeid);
};

module.exports = MemberCardDirectiveController;
