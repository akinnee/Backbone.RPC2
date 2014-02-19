module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  // Load Grunt plugins
  grunt.loadTasks('grunt_tasks');

  // Tasks
  grunt.registerTask('dev', 'Run tests and other dev related tasks.', [
    'connect:dev', 'jasmine:run'
  ]);

  // Default task
  grunt.registerTask('default', ['dev']);

};