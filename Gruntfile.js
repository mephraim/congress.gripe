var govTrack = require('govtrack-node');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.registerTask('snapshotCongress', 'Grabs a snapshot of the current members of congress.', function() {
    var done = this.async();

    govTrack.findRole({ current: true }, function(error, response) {
      grunt.file.write('data/congress.json', JSON.stringify(response));
      done();
    });
  });
};
