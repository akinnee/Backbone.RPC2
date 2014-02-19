module.exports = function(grunt) {

  grunt.config.set('watch', {
    jasmine: {
      files: [
        '<%= jasmine.run.src %>',
        '<%= jasmine.run.options.specs %>'
      ],
      tasks: ['jasmine:run']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');

};