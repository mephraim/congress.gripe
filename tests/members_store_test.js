var MembersStore = require('../site/js/lib/members_store.js');

describe('MembersStore', function() {
  var subject;
  beforeEach(function() {
    subject = new MembersStore(require('./data/role_data.js'));
  });

  describe('findAllForState', function() {
    it('finds all members for a full state name', function() {
      var found = subject.findAllForState('Iowa');
      expect(found.map(function(member) {
        return member.person.id;
      }).sort()).toEqual([400034, 400080, 400090]);

      var found = subject.findAllForState('Minnesota');
      expect(found.map(function(member) {
        return member.person.id;
      }).sort()).toEqual([400040]);
    });

    it('finds all members for a state abbreviation', function() {
      var found = subject.findAllForState('IA');
      expect(found.map(function(member) {
        return member.person.id;
      }).sort()).toEqual([400034, 400080, 400090]);

      var found = subject.findAllForState('Minnesota');
      expect(found.map(function(member) {
        return member.person.id;
      }).sort()).toEqual([400040]);
    });

    it('finds all members for a role type', function() {
      var found = subject.findAllForState('Iowa', MembersStore.ROLE_TYPE_REPRESENTATIVE);
      expect(found.map(function(member) {
        return member.person.id;
      }).sort()).toEqual([400034]);

      var found = subject.findAllForState('Iowa', MembersStore.ROLE_TYPE_SENATOR);
      expect(found.map(function(member) {
        return member.person.id;
      }).sort()).toEqual([400080, 400090]);
    });
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

      var hillary = subject.findRepresentativeForDistrict('MN', 2);
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
  });
});
