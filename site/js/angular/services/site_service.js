/**
 * @ngInject
 */
function SiteService() {
  var IS_SITE_HEADER_VISIBLE = false;

  return {
    /**
     * Gets the visibility of the site header.
     * @returns {Boolean}
     */
    isSiteHeaderVisible: function() {
      return IS_SITE_HEADER_VISIBLE;
    },

    /**
     * Sets the visibility of the global site header.
     * @param {Boolean} isVisible
     */
    setSiteHeaderVisibility: function(isVisible) {
      IS_SITE_HEADER_VISIBLE = isVisible;
    }
  };
}

module.exports = SiteService;
