/**
 * @ngInject
 */
function MembersController($http, $window) {
  this.$http = $http;
  this.$window = $window;
  this._loadMembers();
}

MembersController.prototype.showMore = function(member) {
  this.current = member;
  this._loadHangoutButton(member.phone);
};

MembersController.prototype.closeMore = function() {
  this.current = null;
};

MembersController.prototype._loadMembers = function() {
  var self = this;
  self.$http.get('/assets/javascripts/congress.json').then(function(response) {
    self.members = response.data.objects;
    console.log(self.members[0]);
  });
};

MembersController.prototype._loadHangoutButton = function(phone) {
  this.$window.gapi.hangout.render('hangout-placeholder', {
    'invites': [
      {
        id : phone,
        invite_type : 'PHONE'
      }
    ],
    'render': 'createhangout',
    'widget_size': 72
  });
};

module.exports = MembersController;
