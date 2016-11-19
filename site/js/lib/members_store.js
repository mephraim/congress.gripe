var Fuse = require('fuse.js');

/**
 * A wrapper class that builds a collection for searching members of congress.
 * @constructor
 */
function MembersStore(data) {
  this._loadData(data);
}

/**
 * Search for a member for congress.
 *
 * @param {String} query
 * @returns [Object[]]
 */
MembersStore.prototype.search = function(query) {
  return this._memberFuse.search(query);
};

/**
 * Loads the member data and creates the Fuse collection for searching.
 *
 * @private
 * @param {Object[]}
 */
MembersStore.prototype._loadData = function(data) {
  this._memberFuse = new Fuse(data.objects, {
    shouldSort: true,
    threshold: 0.5,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    keys: [
      'party',
      'person.firstname',
      'person.gender',
      'person.lastname',
      'person.twitterid',
      'person.youtubeid'
    ]
  });
};

module.exports = MembersStore;
