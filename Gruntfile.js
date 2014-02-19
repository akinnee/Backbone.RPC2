module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  // Load Grunt plugins
  grunt.loadTasks('grunt_tasks');

  // Tasks
  grunt.registerTask('dev', 'Run tests and other dev related tasks.', [
    'mockapi', 'connect:dev', 'jasmine:run', 'watch'
  ]);

  // Mock API server
  grunt.registerTask('mockapi', 'Start a mock JSON RPC 2.0 API server.', function() {
    require('./tests/test_server/jsonrpc_server.js');
  });

  // Default task
  grunt.registerTask('default', ['dev']);

};