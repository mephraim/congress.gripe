var stateInfo = require('../../lib/state_info.js');

function StateInfoService() {
  return {
    /**
     * Returns the abbreviation of a state given the name.
     *
     * @param {String} name
     * @returns {String}
     */
    getAbbreviation: function(query) {
      return stateInfo.getAbbreviation(query);
    },

    /**
     * Returns a class that can be used to draw a state character using the
     * StateFace font.
     *
     * @param {String} state
     * @returns {String}
     */
    getFontClass: function(state) {
      return stateInfo.getFontClass(state);
    },

    /**
     * Returns the full name of a state given the abbreviation.
     *
     * @param {String} abbreviation
     * @returns {String}
     */
    getName: function(query) {
      return stateInfo.getName(query);
    },

    /**
     * Is there are state that matches the name or abbreviation?
     *
     * @param {String} query
     * @returns {Boolean}
     */
    isState: function(query) {
      return stateInfo.isState(query);
    },

    /**
     * Is there a state that matches the abbreviation?
     *
     * @param {String} query
     * @returns {Boolean}
     */
    isStateAbbreviation: function(query) {
      return stateInfo.isStateAbbreviation(query);
    },

    /**
     * Is there a state that matches the name?
     *
     * @param {String} query
     * @returns {Boolean}
     */
    isStateName: function(query) {
      return stateInfo.isStateName(query);
    }
  };
}

module.exports = StateInfoService;
