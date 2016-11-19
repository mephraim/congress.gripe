/**
 * @ngInject
 */
function HangoutService($window) {
  return {
    renderButton: function(domId, phoneNumber) {
      $window.gapi.hangout.render(domId, {
        'invites': [
          {
            id : phoneNumber,
            invite_type : 'PHONE'
          }
        ],
        'render': 'createhangout',
        'widget_size': 72
      });
    }
  };
}

module.exports = HangoutService;
