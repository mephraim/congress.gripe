/**
 * @ngInject
 */
function HangoutService($window) {
  return {
    /**
     * Renders a hangout button for the phone number.
     *
     * @param {String|Element} element The DOM node or ID where the button should go.
     * @param {String} phoneNumber
     */
    renderButton: function(element, phoneNumber) {
      $window.gapi.hangout.render(element, {
        'invites': [
          {
            id : phoneNumber,
            invite_type : 'PHONE'
          }
        ],
        'render': 'createhangout',
        'widget_size': 136
      });
    }
  };
}

module.exports = HangoutService;
