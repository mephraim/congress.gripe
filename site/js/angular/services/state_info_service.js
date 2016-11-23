var stateInfo = require('../../lib/state_info.js');

function StateInfoService() {
  // Forward all calls to the underlying stateInfo class.
  return stateInfo;
}

module.exports = StateInfoService;
