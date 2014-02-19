module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  // Load Grunt plugins
  grunt.loadTasks('grunt_tasks');

  // Tasks
  grunt.registerTask('dev', 'Run the required dev tasks and watch for changes.', [
    'connect', 'jasmine'
  ]);

  // Default task
  grunt.registerTask('default', ['dev']);

};