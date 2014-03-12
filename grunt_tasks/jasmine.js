module.exports = function(grunt) {

  grunt.config.set('jasmine', {

    /**
     * Actually run the tests
     */
    run: {
      src: [
        'backbone.rpc2.js'
      ],
      options: {
        host: 'http://localhost:8085',
        vendor: [
          'tests/vendor/jquery-2.1.0.min.js',
          'jquery.jsonrpcclient/jquery.jsonrpcclient.js',
          'tests/vendor/underscore-min.js',
          'tests/vendor/backbone-min.js'
        ],
        specs: [
          'tests/backbone.rpc2_spec.js'
        ],
        keepRunner: true
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');

};