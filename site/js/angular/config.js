/**
 * @ngInject
 */
function Config($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true);

  $routeProvider.
    when('/', {
      controller:'HomeController as homeCtrl',
      templateUrl:'/templates/home.html',
    }).
    when('/members/:memberId', {
      controller:'MemberController as memberCtrl',
      templateUrl:'/templates/member.html'
    }).
    otherwise({
      redirectTo:'/'
    });
}

module.exports = Config;
