var govTrack = require('govtrack-node');
var congressMembers = require('./scripts/congress_members.js');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.registerTask('snapshotCongress', 'Grabs a snapshot of the current members of congress.', function() {
    var done = this.async();
    congressMembers.getDataFromAPI().then(function(data) {
      console.log('Writing data...');
      grunt.file.write('data/congress.json', JSON.stringify(data));

      done();
    });
  });

  grunt.registerTask('moveDataToAssets', 'Moves the snapshotted data to the assets directory', function() {
    grunt.file.write('public/assets/data/congress.js', JSON.stringify(congressMembers.getDataFromFile()));
  });
};
