/**
 * @ngInject
 */
function Run($timeout, $location, $rootScope, $window) {
  // Once a view has loaded, notify the JS code for Material Design Lite
  $rootScope.$on('$viewContentLoaded', function() {
    $window.componentHandler.upgradeDom();
  });

  handle404Redirect();

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
}

module.exports = Run;
