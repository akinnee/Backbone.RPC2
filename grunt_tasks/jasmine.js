module.exports = function(grunt) {

  grunt.config.set('jasmine', {
    options: {
      host: 'http://localhost:8085',
      vendor: [
        'vendor/jquery-1.11.0.min.js',
        'jquery.jsonrpcclient/jquery.jsonrpcclient.js',
        'vendor/underscore-min.js',
        'vendor/backbone-min.js'
      ],
      specs: ['tests/backbone.rpc2_spec.js']
    },
    src: ['backbone.rpc2.js']
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');

};