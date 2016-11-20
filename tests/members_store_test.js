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

    it('finds a member by their full state name', function() {
      var ronald = subject.search('Iowa')[0];
      expect(ronald.person.id).toEqual(400034);
      expect(ronald.person.firstname).toEqual('Ronald');
      expect(ronald.person.lastname).toEqual('McDonald');

      var hillary = subject.search('Minnesota')[0];
      expect(hillary.person.id).toEqual(400040);
      expect(hillary.person.firstname).toEqual('Hillary');
      expect(hillary.person.lastname).toEqual('Clinton');
    });

    it('finds a member by their state abbreviation', function() {
      var ronald = subject.search('ia')[0];
      expect(ronald.person.id).toEqual(400034);
      expect(ronald.person.firstname).toEqual('Ronald');
      expect(ronald.person.lastname).toEqual('McDonald');

      var hillary = subject.search('MN')[0];
      expect(hillary.person.id).toEqual(400040);
      expect(hillary.person.firstname).toEqual('Hillary');
      expect(hillary.person.lastname).toEqual('Clinton');
    });
  });

  describe('findById', function() {
    it('finds a member by their govtrack id', function() {
      var found = subject.findById(400034);

      expect(found.person.id).toEqual(400034);
      expect(found.person.firstname).toEqual('Ronald');
      expect(found.person.lastname).toEqual('McDonald');
    });
  });
});
