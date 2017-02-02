var govTrack = require('govtrack-node');
var congressMembers = require('./scripts/congress_members.js');
var congressionalDistricts = require('./scripts/congressional_districts.js');
var congressDistrictsByZipCode = require('./scripts/congressional_districts_by_zipcode.js');

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

  grunt.registerTask('indexRawZipcodeDistrictData', 'Grabs a snapshot of the raw zip code => district files', function() {
    var done = this.async();
    congressDistrictsByZipCode.getRawDataFiles().then(function(data) {
      data.forEach(function(item) {
        var file = 'data/congressional_districts_by_zipcode_raw/' + item.state.toLowerCase() + '_data.csv';
        grunt.file.write(file, item.data);
      });

      done();
    });
  });

  grunt.registerTask('parseRawZipcodeDistrictData', 'Parses the raw zip code => district data and indexes it as JSON', function() {
    var done = this.async();
    congressDistrictsByZipCode.parseRawDistrictData().then(function(data) {
      grunt.file.write('data/congressional_districts_by_zipcode.json', JSON.stringify(data));
      done();
    });
  });
};
