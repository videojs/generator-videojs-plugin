import loadGruntTasks from 'load-grunt-tasks';
import timeGrunt from 'time-grunt';

const init = function(grunt) {

  const KARMA_BROWSERS = [
    'chrome',
    'firefox',
    'ie',
    'opera',
    'safari'
  ];

  timeGrunt(grunt);

  grunt.initConfig({

    banner: grunt.file.read('scripts/banner.ejs'),
    pkg: grunt.file.readJSON('package.json'),
    year: grunt.template.today('yyyy'),

    browserify: {

      options: {
        transform: [
          'babelify',
          'browserify-shim'
        ]
      },

      js: {
        options: {
          banner: '<%%= banner %>',
          browserifyOptions: {
            standalone: '<%%= pkg.name %>'
          }
        },
        src: 'src/plugin.js',
        dest: 'dist/<%%= pkg.name %>.js'
      },

      'watch-js': {
        options: {
          watch: true,
          keepAlive: true
        },
        src: '<%%= browserify.js.src %>',
        dest: '<%%= browserify.js.dest %>'
      },

      test: {
        src: 'test/**/*.test.js',
        dest: 'test/bundle.js'
      },

      'watch-test': {
        options: {
          watch: true,
          keepAlive: true
        },
        src: '<%%= browserify.test.src %>',
        dest: '<%%= browserify.test.dest %>'
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
        tasks: [
          'connect:start',
<% if (sass) { -%>
          'contrib-watch',
<% } -%>
          'browserify:watch-js',
          'browserify:watch-test'
        ]
      },

      watch: {
        tasks: [
<% if (sass) { -%>
          'contrib-watch',
<% } -%>
          'browserify:watch-js',
          'browserify:watch-test'
        ]
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

    karma: (() => {
      var karma = {
        detected: {
          options: {
            configFile: 'test/karma/detected.js'
          }
        }
      };

      KARMA_BROWSERS.forEach(function(browser) {
        karma[browser] = {
          options: {
            configFile: `test/karma/${browser}.js`
          }
        };
      });

      return karma;
    })(),

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
      dist: {
        options: {
          outputStyle: 'compressed'
        },
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
<% if (sass) { -%>
    },

    usebanner: {
      options: {
        banner: '<%%= banner %>'
      },
      css: {
        src: 'dist/<%%= pkg.name %>.css'
      }
    },

    'contrib-watch': {
      css: {
        files: 'src/**/*.scss',
        tasks: ['sass:dist']
      }
<% } -%>
    }
  });

  loadGruntTasks(grunt);

<% if (sass) { -%>
  // The grunt-contrib-watch task gets renamed so that "watch" can be used as
  // an alias for "concurrent:watch".
  grunt.renameTask('watch', 'contrib-watch');

<% } -%>
  grunt.registerTask('build', [
    'clean:dist',
<% if (sass) { -%>
    'build:css',
<% } -%>
    'build:js',
    'build:test'
  ]);

<% if (sass) { -%>
  grunt.registerTask('build:css', ['sass:dist', 'usebanner:css']);
<% } -%>
  grunt.registerTask('build:js', ['browserify:js', 'uglify:js']);
  grunt.registerTask('build:test', ['browserify:test']);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('docs', ['run:docs']);
  grunt.registerTask('lint', ['run:lint']);

  grunt.registerTask('start', [
    'docs',
    'build',
    'concurrent:start'
  ]);

  // Create tasks for each Karma browser.
  KARMA_BROWSERS.forEach((browser) => {
    grunt.registerTask('test:' + browser, [
      'lint',
      'build:test',
      'karma:' + browser
    ]);
  });

  grunt.registerTask('test', ['test:detected']);
  grunt.registerTask('watch', ['concurrent:watch']);
  grunt.registerTask('watch:css', ['contrib-watch']);
  grunt.registerTask('watch:js', ['browserify:watch-js']);
  grunt.registerTask('watch:test', ['browserify:watch-test']);
};

export default init;
