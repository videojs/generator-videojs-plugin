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
    year: new Date(),

    babel: {
      js: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['**/*.js'],
          dest: 'es5',
          ext: '.js'
        }]
      }
    },

    browserify: {

      options: {
        transform: ['browserify-shim']
      },

      js: {
        options: {
          banner: '<%%= banner %>',
          browserifyOptions: {
            standalone: '<%%= pkg.name %>'
          }
        },
        src: 'es5/plugin.js',
        dest: 'dist/<%%= pkg.name %>.js'
      },

      test: {
        options: {
          transform: ['babelify', 'browserify-shim']
        },
        src: 'test/**/*.test.js',
        dest: 'test/bundle.js'
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

    karma: (() => {
      let karma = {
        detected: {
          options: {
            configFile: 'test/karma/detected.js'
          }
        }
      };

      KARMA_BROWSERS.forEach(browser => {
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
    },

<% if (sass) { -%>
    usebanner: {
      options: {
        banner: '<%%= banner %>'
      },
      css: {
        src: 'dist/<%%= pkg.name %>.css'
      }
    },

<% } -%>
    watch: {
      css: {
        files: 'src/**/*.scss',
        tasks: ['sass:dist']
      },
      js: {
        files: 'src/**/*.js',
        tasks: ['babel:js', 'browserify:js']
      },
      test: {
        files: ['src/**/*.js', 'test/**/*.js'],
        tasks: ['browserify:test']
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
  grunt.registerTask('build:css', ['sass:dist', 'usebanner:css']);
<% } -%>
  grunt.registerTask('build:js', ['babel:js', 'browserify:js', 'uglify:js']);
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
};

export default init;
