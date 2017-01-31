/**
 * Top level controller for the site's base template.
 * @ngInject
 */
function SiteController(SiteService) {
  this.SiteService = SiteService;
}

/**
 * Is the global site header visible?
 * @returns {Boolean}
 */
SiteController.prototype.isHeaderVisible = function() {
  return this.SiteService.isSiteHeaderVisible();
};

module.exports = SiteController;
