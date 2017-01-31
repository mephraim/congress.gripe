var _ = require('underscore');
var fs = require('fs');
var govTrack = require('govtrack-node');
var path = require('path');
var Promise = require('promise');
var stateInfo = require('../site/js/lib/state_info.js');

var CONGRESS_PATH = path.resolve(__dirname, '../data/congress.json');

module.exports = {
  getDataFromAPI: getDataFromAPI
};

function getDataFromAPI() {
  return new Promise(function(resolve, reject) {
    govTrack.findRole({ current: true, limit: 1000 }, function(error, response) {
      resolve(addCustomData(getValidMembers(response)));
    });
  });
}

function addCustomData(members) {
  members.forEach(function(member) {
    member.customData = {
      fullStateName: stateInfo.getName(member.state.toUpperCase())
    };
  });

  return members;
}

function getValidMembers(data) {
  return _.filter(data.objects, function(member) {
    // Filter out president and vice president because they don't have the same
    // data that members of congress have (and they're not actually members of
    // congress).
    return member.role_type != 'president' &&
           member.role_type != 'vicepresident';
  });
}
