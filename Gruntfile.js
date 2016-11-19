var govTrack = require('govtrack-node');
var congressMembers = require('./scripts/congress_members.js');

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
};
