/**
 * @ngInject
 */
function Run($timeout, $location, $rootScope, $window, SiteService) {
  // Once a view has loaded, notify the JS code for Material Design Lite
  $rootScope.$on('$viewContentLoaded', function() {
    $window.componentHandler.upgradeDom();
  });

  handle404Redirect();
  initAnalytics();
  initSiteHeader();

  /**
   * Handle redirects from 404.html
   *
   * This is a Github pages specific hack to redirect arbitrary urls back to the
   * app. It won't be necessary once the site is moved to a host that allows url
   * rewrites.
   */
  function handle404Redirect() {
    var redirect = $window.sessionStorage.redirectFrom404;
    delete $window.sessionStorage.redirectFrom404;

    $timeout(function() {
      if (redirect && redirect != $location.url()) {
        $location.path(redirect);
        $location.replace();
      }
    }, 0);
  }

  /**
   * Initializes Google Analytics.
   */
  function initAnalytics() {
    if (!$window.ga) {
      return;
    }

    // Initialize
    $window.ga('create', 'UA-91161539-1', 'auto');

    // Send a pageview when the page has changed.
    $rootScope.$on('$viewContentLoaded', function (event) {
      $window.ga('send', 'pageview', $location.path());
    });
  }

  /**
   * Initializes the default state for the site header.
   * (There has to be a better way to do this)
   */
  function initSiteHeader() {
    $rootScope.$on('$viewContentLoaded', function() {
      // Hide the site header by default on the homepage, but show it by default
      // everywhere else.
      if ($location.path() == '/') {
        SiteService.setSiteHeaderVisibility(false);
      } else {
        SiteService.setSiteHeaderVisibility(true);
      }
    });
  }
}

module.exports = Run;
