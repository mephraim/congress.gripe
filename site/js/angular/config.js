/**
 * @ngInject
 */
function Config($locationProvider, $routeProvider, $sceDelegateProvider) {
  $locationProvider.html5Mode(true);

  $sceDelegateProvider.resourceUrlWhitelist([
    'self',

    // Allow JSONP requests to the Census Geocoder
    'http://geocoding.geo.census.gov/geocoder/**'
  ]);

  $routeProvider.
    when('/', {
      controller:'HomeController as homeCtrl',
      reloadOnSearch: false,
      templateUrl: '/templates/home.html',
    }).

    when('/members/:name/:memberId', {
      controller: 'MemberController as memberCtrl',
      templateUrl: '/templates/member.html'
    }).

    when('/states/:name', {
      controller: 'StateController as stateCtrl',
      templateUrl: '/templates/state.html'
    }).

    when('/states/:name/district/:district', {
      controller: 'StateController as stateCtrl',
      templateUrl: '/templates/state.html'
    }).

    otherwise({
      redirectTo: ''
    });
}

module.exports = Config;
