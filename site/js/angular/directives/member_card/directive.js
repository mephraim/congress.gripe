/**
 * @ngInject
 */
function MemberCardDirective() {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      member: '&'
    },
    controller: require('./controller.js'),
    controllerAs: 'memberCardCtrl',
    templateUrl: '/templates/directives/member_card.html'
  };
}

module.exports = MemberCardDirective;
