/**
 * @ngInject
 */
function MemberCardChipsDirective() {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      member: '&'
    },
    controller: require('./controller.js'),
    controllerAs: 'memberCardChipsCtrl',
    templateUrl: '/templates/directives/member_card_chips.html'
  };
}

module.exports = MemberCardChipsDirective;
