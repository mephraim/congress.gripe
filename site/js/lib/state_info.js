var _ = require('underscore');

var STATE_INFO = [
  { name: 'Alabama', abbreviation: 'AL' },
  { name: 'Alaska', abbreviation: 'AK' },
  { name: 'American', abbreviation: 'AS' },
  { name: 'Arizona', abbreviation: 'AZ' },
  { name: 'Arkansas', abbreviation: 'AR' },
  { name: 'California', abbreviation: 'CA' },
  { name: 'Colorado', abbreviation: 'CO' },
  { name: 'Connecticut', abbreviation: 'CT' },
  { name: 'Delaware', abbreviation: 'DE' },
  { name: 'Distict of Columbia', abbreviation: 'DC' },
  { name: 'Florida', abbreviation: 'FL' },
  { name: 'Georgia', abbreviation: 'GA' },
  { name: 'Guam', abbreviation: 'GU' },
  { name: 'Hawaii', abbreviation: 'HI' },
  { name: 'Idaho', abbreviation: 'ID' },
  { name: 'Illinois', abbreviation: 'IL' },
  { name: 'Indiana', abbreviation: 'IN' },
  { name: 'Iowa', abbreviation: 'IA' },
  { name: 'Kansas', abbreviation: 'KS' },
  { name: 'Kentucky', abbreviation: 'KY' },
  { name: 'Louisiana', abbreviation: 'LA' },
  { name: 'Maine', abbreviation: 'ME' },
  { name: 'Maryland', abbreviation: 'MD' },
  { name: 'Marshall', abbreviation: '  MH' },
  { name: 'Massachusetts', abbreviation: 'MA' },
  { name: 'Michigan', abbreviation: 'MI' },
  { name: 'Micronesia', abbreviation: 'FM' },
  { name: 'Minnesota', abbreviation: 'MN' },
  { name: 'Mississippi', abbreviation: 'MS' },
  { name: 'Missouri', abbreviation: 'MO' },
  { name: 'Montana', abbreviation: 'MT' },
  { name: 'Nebraska', abbreviation: 'NE' },
  { name: 'Nevada', abbreviation: 'NV' },
  { name: 'New Hampshire', abbreviation: 'NH' },
  { name: 'New Jersey', abbreviation: 'NJ' },
  { name: 'New Mexico', abbreviation: 'NM' },
  { name: 'New York', abbreviation: 'NY' },
  { name: 'North Carolina', abbreviation: 'NC' },
  { name: 'North Dakota', abbreviation: 'ND' },
  { name: 'Northern Marianas', abbreviation: 'MP' },
  { name: 'Ohio', abbreviation: 'OH' },
  { name: 'Oklahoma', abbreviation: 'OK' },
  { name: 'Oregon', abbreviation: 'OR' },
  { name: 'Palau', abbreviation: 'PW' },
  { name: 'Pennsylvania', abbreviation: 'PA' },
  { name: 'Puerto Rico', abbreviation: 'PR' },
  { name: 'Rhode Island', abbreviation: 'RI' },
  { name: 'South Carolina', abbreviation: 'SC' },
  { name: 'South Dakota', abbreviation: 'SD' },
  { name: 'Tennessee', abbreviation: 'TN' },
  { name: 'Texas', abbreviation: 'TX' },
  { name: 'Utah', abbreviation: 'UT' },
  { name: 'Vermont', abbreviation: 'VT' },
  { name: 'Virginia', abbreviation: 'VA' },
  { name: 'Virgin Islands', abbreviation: 'VI' },
  { name: 'Washington', abbreviation: 'WA' },
  { name: 'West Virginia', abbreviation: 'WV' },
  { name: 'Wisconsin', abbreviation: 'WI' },
  { name: 'Wyoming', abbreviation: 'WY' }
];

module.exports = {
  getAbbreviation: getAbbreviation,
  getFontClass: getFontClass,
  getName: getName,
  isState: isState,
  isStateAbbreviation: isStateAbbreviation,
  isStateName: isStateName
};

/**
  * Returns the abbreviation of a state given the name.
  *
  * @param {String} name
  * @returns {String}
  */
function getAbbreviation(name) {
  var found = _.find(STATE_INFO, function(state) {
    return state.name.toLowerCase() ==
           name.toLowerCase().trim();
  });

  if (found) {
    return found.abbreviation;
  }
}

/**
 * Returns a class that can be used to draw a state character using the
 * StateFace font.
 *
 * @param {String} state
 * @returns {String}
 */
function getFontClass(state) {
  if (!isState(state)) {
    return;
  }

  if (isStateAbbreviation(state)) {
    state = getName(state);
  }

  return 'state-face-' + state.toLowerCase();
}

/**
  * Returns the full name of a state given the abbreviation.
  *
  * @param {String} abbreviation
  * @returns {String}
  */
function getName(abbreviation) {
  var found = _.find(STATE_INFO, function(state) {
    return state.abbreviation.toLowerCase() ==
           abbreviation.toLowerCase().trim();
  });

  if (found) {
    return found.name;
  }
}

/**
 * Is there are state that matches the name or abbreviation?
 *
 * @param {String} query
 * @returns {Boolean}
 */
function isState(query) {
  return isStateAbbreviation(query.trim()) ||
         isStateName(query.trim());
}

/**
 * Is there a state that matches the abbreviation?
 *
 * @param {String} query
 * @returns {Boolean}
 */
function isStateAbbreviation(query) {
  return !!_.find(STATE_INFO, function(state) {
    return state.abbreviation.toLowerCase() ==
           query.toLowerCase().trim();
  });
}

/**
 * Is there a state that matches the name?
 *
 * @param {String} query
 * @returns {Boolean}
 */
function isStateName(query) {
  return !!_.find(STATE_INFO, function(state) {
    return state.name.toLowerCase() ==
           query.toLowerCase().trim();
  });
}
