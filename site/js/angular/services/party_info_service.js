/**
 * @ngInject
 */
function PartyColorService() {
  return {
    /**
     * Returns a single letter abbreviation for the member's party.
     *
     * @param {Object} member
     * @returns {String}
     */
    getPartyAbbreviationForMember: function(member) {
      if (_isDemocrat(member)) {
        return 'D';
      } else if (_isRepublican(member)) {
        return 'R';
      } else {
        return 'I';
      }
    },

    /**
     * Returns a background color class array for the member's party.
     *
     * @param {Object} member
     * @returns {String[]}
     */
    getPartyBackgroundColorForMember: function(member) {
      if (_isDemocrat(member)) {
        return ['mdl-color--blue'];
      } else if (_isRepublican(member)) {
        return ['mdl-color--red'];
      } else {
        return ['mdl-color--green'];
      }
    },

    /**
     * Returns a text color class array for the member's party.
     *
     * @param {Object} member
     * @returns {String[]}
     */
    getPartyTextColorForMember: function(member) {
      if (_isDemocrat(member)) {
        return ['mdl-color-text--blue'];
      } else if (_isRepublican(member)) {
        return ['mdl-color-text--red'];
      } else {
        return ['mdl-color-text--green'];
      }
    }
  };

  /**
   * Is the member's party Democrat?
   *
   * @private
   * @param {Object} member
   * @returns {Boolean}
   */
  function _isDemocrat(member) {
    return member.party &&
           member.party.toLowerCase() == 'democrat';
  }

  /**
   * Is the member's party Republican?
   *
   * @private
   * @param {Object} member
   * @returns {Boolean}
   */
  function _isRepublican(member) {
    return member.party &&
           member.party.toLowerCase() == 'republican';
  }
}

module.exports = PartyColorService;
