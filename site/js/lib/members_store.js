var _ = require('underscore');
var stateInfo = require('./state_info.js');
var Fuse = require('fuse.js');

/**
 * A wrapper class that builds a collection for searching members of congress.
 * @constructor
 */
function MembersStore(data) {
  this._loadData(data);
}

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
 * Search for members of congress who match the query.
 *
 * @param {String} query
 * @returns [Object[]]
 */
MembersStore.prototype.search = function(query) {
  if (stateInfo.isState(query.trim())) {
    return this.searchByState(query);
  }

  return this._memberFuse.search(query);
};

/**
 * Search for members who match the state.
 *
 * @param {String} state
 * @return {Object[]}
 */
MembersStore.prototype.searchByState = function(state) {
  if (stateInfo.isStateAbbreviation(state)) {
    state = stateInfo.getName(state);
  }

  return _.filter(this._members, function(member) {
    return member.customData.fullStateName &&
           (member.customData.fullStateName.toLowerCase() ==
            state.toLowerCase());
  });
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
