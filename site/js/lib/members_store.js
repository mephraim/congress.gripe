var _ = require('underscore');
var stateInfo = require('./state_info.js');
var Fuse = require('fuse.js');

var ROLE_TYPE_REPRESENTATIVE = 'representative';
var ROLE_TYPE_SENATOR = 'senator';

/**
 * A wrapper class that builds a collection for searching members of congress.
 * @constructor
 */
function MembersStore(data) {
  this._loadData(data);
}

MembersStore.ROLE_TYPE_REPRESENTATIVE = ROLE_TYPE_REPRESENTATIVE;
MembersStore.ROLE_TYPE_SENATOR = ROLE_TYPE_SENATOR;

/**
 * Find a member by their govtrack ID.
 *
 * @param {Number} id
 * @returns {Object}
 */
MembersStore.prototype.findById = function(id) {
  return _.find(this._members, function(member) {
    return member.person.id === id;
  });
};

/**
 * Find all of the senators and representatives for a state.
 *
 * @param {String} state
 * @param {String?} roleType
 * @return {Object[]}
 */
MembersStore.prototype.findAllForState = function(state, roleType) {
  if (stateInfo.isStateName(state)) {
    state = stateInfo.getAbbreviation(state);
  }

  return this._sort(_.filter(this._members, function(member) {
    return (member.state &&
            (member.state.toLowerCase() === state.toLowerCase())) &&

           // Only take role type into consideration if one was passed in.
           (!roleType || (member.role_type == roleType));
  }));
};

/**
 * Find the senators and representatives for a district.
 *
 * @param {String} state
 * @param {Number} district
 * @returns {Object[]}
 */
MembersStore.prototype.findAllForDistrict = function(state, district) {
  return this.findSenatorsForState(state).concat(
           this.findRepresentativeForDistrict(state, district));
};

/**
 * Find the representative for a specific district.
 *
 * @param {String} state
 * @param {Number} district
 * @returns {Object}
 */
MembersStore.prototype.findRepresentativeForDistrict = function(state, district) {
  return _.find(this._members, function(member) {
    return member.role_type == ROLE_TYPE_REPRESENTATIVE &&
           member.state === state &&
           // If the district isn't specified,return the first representative
           // found for the state (some states only have one district and don't
           // have a district number)
           (!district || member.district === district);
  });
};

/**
 * Find the senators for the state.
 *
 * @param {String} state
 * @returns {Object[]}
 */
MembersStore.prototype.findSenatorsForState = function(state) {
  return _.filter(this._members, function(member) {
    return member.role_type === ROLE_TYPE_SENATOR &&
           member.state === state;
  });
};

/**
 * Search for members of congress who match the query.
 *
 * @param {String} query
 * @returns [Object[]]
 */
MembersStore.prototype.search = function(query) {
  if (stateInfo.isState(query.trim())) {
    return this.findAllForState(query);
  }

  return this._memberFuse.search(query);
};

/**
 * Loads the member data and creates the Fuse collection for searching.
 *
 * @private
 * @param {Object[]}
 */
MembersStore.prototype._loadData = function(data) {
  this._members = data;
  this._memberFuse = new Fuse(data, {
    distance: 100,
    location: 0,
    maxPatternLength: 32,
    shouldSort: true,
    threshold: 0.3,
    keys: [
      { name: 'person.nickname', weight: 0.9 },
      { name: 'person.name', weight: 0.8 },
      { name: 'person.firsname', weight: 0.3 },
      { name: 'person.lastname', weight: 0.3 }
    ]
  });
};

/**
 * Sorts the members by district or name (depending on what's available).
 *
 * @param {Object[]} members
 * @returns {Object[]}
 */
MembersStore.prototype._sort = function(members) {
  return members.sort(function(memberA, memberB) {
    // If one of the members doesn't have a district, use last names for sorting.
    if (!memberA.district || !memberB.district) {
      if (memberA.person.lastname.toLowerCase() < memberB.person.lastname.toLowerCase()) {
        return -1;
      }

      if (memberA.person.lastname.toLowerCase() > memberB.person.lastname.toLowerCase()) {
        return 1;
      }

      return 0;
    }

    return memberA.district - memberB.district;
  });
};

module.exports = MembersStore;
