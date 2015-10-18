/* jshint browser: false, node: true */
'use strict';

var _ = require('lodash');

module.exports = function(grunt) {

  grunt.initConfig({

    banner: [
      '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n',
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>; Licensed <%= pkg.license %> */',
    ].join(''),

    browserify: {
      options: {
        browserifyOptions: {
          standalone: '<%= pkg.name %>'
        },
        transform: [
          'babelify',
          'browserify-shim'
        ]
      },
      dist: {
        src: ['src/plugin.js'],
        dest: 'dist/<%= pkg.name %>.js'
      },
      test: {
        options: {
          browserifyOptions: {
            standalone: false
          }
        },
        src: ['test/unit/**/*.test.js'],
        dest: 'test/unit/bundle.js'
      }
    },

    clean: {
      css: ['dist/**/*.css'],
      dist: ['dist'],
      js: ['dist/**/*.js']
    },

    concurrent: {
      tasks: ['connect', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },

    connect: {
      options: {
        keepalive: true,
        port: Number(process.env.VJS_CONNECT_PORT) || 9999,
        useAvailablePort: true
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['src/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/unit/.jshintrc'
        },
        src: ['test/**/*.test.js']
      }
    },

    pkg: grunt.file.readJSON('package.json'),

    qunit: {
      unit: 'test/unit/index.html'
    },

    sass: {
      options: {
        outputStyle: 'compressed'
      },
      dist: {
        src: ['src/plugin.scss'],
        dest: 'dist/<%= pkg.name %>.css'
      }
    },

    uglify: {
      options: {
        preserveComments: 'some'
      },
      dist: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },

    usebanner: {
      options: {
        banner: '<%= banner %>'
      },
      css: {
        src: ['dist/<%= pkg.name %>.css']
      },
      js: {
        src: ['dist/<%= pkg.name %>.js']
      }
    },

    watch: {
      css: {
        files: '<%= sass.dist.src %>',
        tasks: ['build:css']
      },
      js: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'build:js']
      },
      test: {
        files: ['<%= jshint.gruntfile.src %>', '<%= jshint.test.src %>'],
        tasks: ['test']
      }
    },

  });

  require('load-grunt-tasks')(grunt);

  _.each({
    'build': ['clean:dist', 'build:css', 'build:js'],
    'build:css': ['clean:css', 'sass:dist', 'usebanner:css'],
    'build:js': ['clean:js', 'browserify:dist', 'usebanner:js', 'uglify'],
    'default': ['test'],
    'dev': ['concurrent'],
    'lint': ['jshint'],
    'test': ['lint', 'build', 'browserify:test', 'qunit'],
  }, function (value, key) {
    grunt.registerTask(key, value);
  });
};
