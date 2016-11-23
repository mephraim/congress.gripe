/**
 * @ngInject
 */
function Config($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true);

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

    otherwise({
      redirectTo: ''
    });
}

module.exports = Config;
