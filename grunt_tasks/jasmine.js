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
          'vendor/jquery-1.11.0.min.js',
          'jquery.jsonrpcclient/jquery.jsonrpcclient.js',
          'vendor/underscore-min.js',
          'vendor/backbone-min.js'
        ],
        specs: [
          'tests/backbone.rpc2_spec.js'
        ]
      }
    },

    /**
     * Generate coverage reports
     */
    coverage: {
      src: [
        '<%= jasmine.run.src %>'
      ],
      options: {
        host: '<%= jasmine.run.options.host %>',
        vendor: [
          '<%= jasmine.run.options.vendor %>'
        ],
        specs: [
          '<%= jasmine.run.options.specs %>'
        ],
        template: require('grunt-template-jasmine-istanbul'),
        templateOptions: {
          coverage: 'tests/coverage/coverage.json',
          report: 'tests/coverage'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');

};