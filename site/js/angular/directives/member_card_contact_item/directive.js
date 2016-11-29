/**
 * @ngInject
 */
function MemberCardContactItemDirective() {
  return {
    restrict: 'E',
    scope: {
      href: '&',
      icon: '@',
      text: '@'
    },
    templateUrl: '/templates/directives/member_card_contact_item.html'
  };
}

module.exports = MemberCardContactItemDirective;
