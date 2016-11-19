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
    distance: 100,
    location: 0,
    maxPatternLength: 32,
    shouldSort: true,
    threshold: 0.3,
    keys: [
      { name: 'person.name', weight: 0.9 },
      { name: 'person.firsname', weight: 0.3 },
      { name: 'person.lastname', weight: 0.3 },
      { name: 'person.twitterid', weight: 0.2 },
      { name: 'person.youtubeid', weight: 0.2 }
    ]
  });
};

module.exports = MembersStore;
