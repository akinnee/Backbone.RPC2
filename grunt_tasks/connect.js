module.exports = function(grunt) {

  grunt.config.set('connect', {
    dev: {
      options: {
        base: ['.'],
        port: 8085,
        hostname: '*',
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-connect');

};