/**
 * @ngInject
 */
function HangoutButtonDirective(HangoutService) {
  return {
    restrict: 'E',
    scope: {
      phoneNumber: '&'
    },

    link: function(scope, el) {
      scope.$watch('phoneNumber()', function() {
        if (scope.phoneNumber()) {
          HangoutService.renderButton(el[0], scope.phoneNumber());
        }
      });
    }
  };
}

module.exports = HangoutButtonDirective;
