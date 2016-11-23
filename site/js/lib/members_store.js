var _ = require('underscore');
var stateInfo = require('./state_info.js');
var Fuse = require('fuse.js');

var MIN_ADDRESS_SEARCH_LENGTH = 3;
var MAX_NAME_SEARCH_LENGTH = 4;

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

  return _.filter(this._members, function(member) {
    return (member.state &&
            (member.state.toLowerCase() === state.toLowerCase())) &&

           // Only take role type into consideration if one was passed in.
           (!roleType || (member.role_type == roleType));
  });
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
           member.district === district;
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
 * Can this query be used to search for an address?
 * The Geolocation API requires a minimum number of words to successfully search
 * for an address.
 *
 * @param {String} query
 * @returns {Boolean}
 */
MembersStore.prototype.isValidAddressSearch = function(query) {
  return query &&
         !_.isEmpty(query.trim()) &&
         query.trim().split(' ').length >= MIN_ADDRESS_SEARCH_LENGTH;
};

/**
 * Can this query be used to search for a name?
 *
 * Some search strings are going to be very slow to search using the Fuse library
 * so restrict the length of names that will be searched using it.
 *
 * @param {String} query
 * @returns {Boolean}
 */
MembersStore.prototype.isValidNameSearch = function(query) {
  return query &&
         !_.isEmpty(query.trim()) &&
         query.trim().split(' ').length <= MAX_NAME_SEARCH_LENGTH;
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
  this._members = data.objects;
  this._memberFuse = new Fuse(data.objects, {
    distance: 100,
    location: 0,
    maxPatternLength: 32,
    shouldSort: true,
    threshold: 0.3,
    keys: [
      { name: 'person.name', weight: 0.9 },
      { name: 'customData.fullStateName', weight: 0.7 },

      { name: 'person.firsname', weight: 0.3 },
      { name: 'person.lastname', weight: 0.3 },
      { name: 'person.twitterid', weight: 0.2 },
      { name: 'person.youtubeid', weight: 0.2 }
    ]
  });
};

module.exports = MembersStore;
