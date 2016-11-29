var govTrack = require('govtrack-node');
var congressMembers = require('./scripts/congress_members.js');
var congressionalDistricts = require('./scripts/congressional_districts.js');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.registerTask('indexCongress', 'Grabs a snapshot of the current members of congress.', function() {
    var done = this.async();
    congressMembers.getDataFromAPI().then(function(data) {
      grunt.file.write('data/congress_members.json', JSON.stringify(data));
      done();
    });
  });

  grunt.registerTask('indexDistricts', 'converts the tab delimited list of congressional districts to a JSON file', function() {
    var done = this.async();
    congressionalDistricts.getDistrictDataFromCsv().then(function(data) {
      grunt.file.write('data/congressional_districts.json', JSON.stringify(data));
      done();
    });
  });
};
