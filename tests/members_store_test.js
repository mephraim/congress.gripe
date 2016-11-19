var MembersStore = require('../site/js/lib/members_store.js');

describe('MembersStore', function() {
  var subject;
  beforeEach(function() {
    subject = new MembersStore(require('./data/role_data.js'));
  });

  describe('search', function() {
    it('finds a member by first name', function() {
      var ronalds = subject.search('Ronald');
      expect(ronalds.length).toEqual(1);
      expect(ronalds[0].person.firstname).toEqual('Ronald');

      var hillaries = subject.search('Hillary');
      expect(hillaries.length).toEqual(1);
      expect(hillaries[0].person.firstname).toEqual('Hillary');
    });

    it('finds a member by last name', function() {
      var ronalds = subject.search('McDonald');
      expect(ronalds.length).toEqual(1);
      expect(ronalds[0].person.firstname).toEqual('Ronald');

      var hillaries = subject.search('Clinton');
      expect(hillaries.length).toEqual(1);
      expect(hillaries[0].person.firstname).toEqual('Hillary');
    });
  });
});
