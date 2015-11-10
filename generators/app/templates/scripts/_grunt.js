import loadGruntTasks from 'load-grunt-tasks';

const init = function(grunt) {

  grunt.initConfig({

    banner: grunt.file.read('scripts/banner.ejs'),
    pkg: grunt.file.readJSON('package.json'),
    year: (new Date()).getFullYear(),

    browserify: {
      options: {
        browserifyOptions: {
          standalone: '<%%= pkg.name %>'
        },
        transform: [
          'babelify',
          'browserify-shim'
        ]
      },
      js: {
        src: 'src/plugin.js',
        dest: 'dist/<%%= pkg.name %>.js'
      },
      test: {
        options: {
          browserifyOptions: {
            standalone: false
          }
        },
        src: 'test/unit/**/*.test.js',
        dest: 'test/unit/<%%= browserify.js.dest %>'
      }
    },

    clean: {
      dist: 'dist'
    },

    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      start: {
        tasks: ['connect:start', 'watch']
      }
    },

    connect: {
      options: {
        keepalive: true,
        useAvailablePort: true
      },
      start: {
        options: {
          port: 9999
        }
      }
    },

    run: {
      docs: {
        exec: 'npm run docs'
      },
      lint: {
        exec: 'npm run lint'
      }
    },

<% if (sass) { -%>
    sass: {
      options: {
        outputStyle: 'compressed'
      },
      dist: {
        src: 'src/plugin.scss',
        dest: 'dist/<%%= pkg.name %>.css'
      }
    },

<% } -%>
    uglify: {
      options: {
        preserveComments: 'some'
      },
      js: {
        src: '<%%= browserify.js.dest %>',
        dest: 'dist/<%%= pkg.name %>.min.js'
      }
    },

    usebanner: {
      options: {
        banner: '<%%= banner %>'
      },
<% if (sass) { -%>
      css: {
        src: 'dist/<%%= pkg.name %>.css'
      },
<% } -%>
      js: {
        src: '<%%= browserify.js.dest %>'
      }
    },

    watch: {
<% if (sass) { -%>
      css: {
        files: '<%%= sass.dist.src %>',
        tasks: ['build:css']
      },
<% } -%>
      js: {
        files: 'src/**/*.js',
        tasks: ['build:js']
      },
      test: {
        files: ['test/**/*.test.js'],
        tasks: ['build:test']
      }
    }
  });

  loadGruntTasks(grunt);

  grunt.registerTask('build', [
    'clean:dist',
<% if (sass) { -%>
    'build:css',
<% } -%>
    'build:js',
    'build:test'
  ]);

<% if (sass) { -%>
  grunt.registerTask('build:css', [
    'sass',
    'usebanner:css'
  ]);

<% } -%>
  grunt.registerTask('build:js', [
    'browserify:js',
    'usebanner:js',
    'uglify'
  ]);

  grunt.registerTask('build:test', [
    'browserify:test'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

  grunt.registerTask('docs', [
    'run:docs'
  ]);

  grunt.registerTask('lint', [
    'run:lint'
  ]);

  grunt.registerTask('start', [
    'docs',
    'build',
    'concurrent:start'
  ]);

  grunt.registerTask('test', [
    'lint',
    'build:test'
    // TODO Karma
  ]);
};

export default init;
