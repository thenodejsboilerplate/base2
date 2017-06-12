/**
 * Created by frank25184 on 7/16/16.
 */
module.exports = function (grunt) {
    // load plugins
  [
    'grunt-exec',
    'grunt-contrib-sass',
    'grunt-contrib-uglify',
    'grunt-contrib-cssmin',
    'grunt-hashres',
    'grunt-contrib-watch'
  ].forEach(function (task) {
    grunt.loadNpmTasks(task)
  })

   // setting plugins
  grunt.initConfig({
        // default folder
    paths: {
      js: 'src/public/js',
      scss: 'src/public/scss',
      css: 'src/public/css',
      release: 'src/public/build/'
    },

    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= paths.scss %>',
          src: ['*.scss'],
          dest: 'src/public/css',
          ext: '.css'
        }]
      }
    },

    uglify: {
      options: {
        mangle: {
          except: ['jQuery']
        }
      },
      dist: {
        files: {
          '<%= paths.release %>/js/app.min.js': ['<%= paths.js %>/**/*.js', '!<%= paths.js %>/*-test/*.js', '!<%= paths.js %>/common/*']
        }
      }
    },

    cssmin: {
      target: {
        files: [
          {
            '<%= paths.release %>/css/app.min.css': ['<%= paths.css %>/*.css', '!<%= paths.css %>/app.css.map']
          }
        ]
      }
    },

    hashres: {
      options: {
        fileNameFormat: '${name}.${hash}.${ext}'
      },
      all: {
        src: [
          '<%= paths.release %>/js/app.min.js',
          '<%= paths.release %>/css/app.min.css'
        ],
        dest: [
          'src/views/layouts/main.handlebars' // change it according to the project's root file
        ]
      }
    },

    watch: {
      options: {
        dateFormat: function (time) {
          grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString())
          grunt.log.writeln('Waiting for more changes...')
        }
      },

      css: {
        files: ['<%= paths.scss %>/**/*.scss'],
        tasks: ['sass', 'hashres']
      },

      js: {
        files: ['<%= paths.js %>/**/*.js'],
        tasks: ['uglify', 'hashres']
      }
    }

  })// end of grunt.initConfig

    // regiter task
    // grunt.registerTask('watch',['watch']);
  grunt.registerTask('default', ['sass', 'cssmin', 'uglify:dist', 'hashres'])
  grunt.registerTask('static', ['sass', 'cssmin', 'uglify:dist', 'hashres'])
}
