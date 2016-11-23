/**
 * @ngInject
 */
function Run($timeout, $location, $window) {
  // Tell Material Design lite to upgrade any elements added after page load.
  $timeout(function() {
    $window.componentHandler.upgradeDom();
  }, 100);

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
        console.log('redirected url: ', redirect);
        $location.path(redirect);
        $location.replace();
      }
    }, 0);
  }
}

module.exports = Run;
