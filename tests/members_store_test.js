var MembersStore = require('../site/js/lib/members_store.js');

describe('MembersStore', function() {
  var subject;
  beforeEach(function() {
    subject = new MembersStore(require('./data/role_data.js'));
  });

  describe('findAllForDistrict', function() {
    it('finds the senators and representatives for a state congressional district', function() {
      var found = subject.findAllForDistrict('IA', 22);
      expect(found.map(function(member) {
        return member.person.id;
      }).sort()).toEqual([400034, 400080, 400090]);
    });
  });

  describe('findRepresentativeForDistrict', function() {
    it('finds a member by their state congressional district', function() {
      var ronald = subject.findRepresentativeForDistrict('IA', 22);
      expect(ronald.person.id).toEqual(400034);

      var hillary = subject.findRepresentativeForDistrict('AR', 2);
      expect(hillary.person.id).toEqual(400040);
    });
  });

  describe('findSenatorsForState', function() {
    it('finds the senators for a specific state', function() {
      var found = subject.findSenatorsForState('IA');
      expect(found[0].person.id).toEqual(400080);
      expect(found[1].person.id).toEqual(400090);
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

  describe('isValidNameSearch', function() {
    it('returns true for queries with <= 4 words', function() {
      expect(subject.isValidNameSearch('Mr. Chuck Grassley Jr.')).toBeTruthy();
    });

    it('returns false for queries with > 4 words', function() {
      expect(subject.isValidNameSearch('This is more than 4 words')).toBeFalsy();
    });

    it('returns false for empty string', function() {
      expect(subject.isValidNameSearch('')).toBeFalsy();
    });

   it('returns false for undefined strings', function() {
      expect(subject.isValidNameSearch()).toBeFalsy();
    });
  });

  describe('isValidAddressSearch', function() {
    it('returns true for queries with >= 3 words', function() {
      expect(subject.isValidAddressSearch('150 North Chicago')).toBeTruthy();
    });

    it('returns false for queries with < 3 words', function() {
      expect(subject.isValidAddressSearch('Chuck Grassley')).toBeFalsy();
    });

    it('returns false for empty strings', function() {
      expect(subject.isValidAddressSearch('')).toBeFalsy();
    });

    it('returns false for undefined strings', function() {
      expect(subject.isValidAddressSearch()).toBeFalsy();
    });
  });

  describe('search', function() {
    it('finds a member by first name', function() {
      var ronalds = subject.search('Ronald');
      expect(ronalds[0].person.firstname).toEqual('Ronald');

      var hillaries = subject.search('Hillary');
      expect(hillaries[0].person.firstname).toEqual('Hillary');
    });

    it('finds a member by last name', function() {
      var ronalds = subject.search('McDonald');
      expect(ronalds[0].person.firstname).toEqual('Ronald');

      var hillaries = subject.search('Clinton');
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
});
