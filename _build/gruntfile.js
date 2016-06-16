module.exports = function(grunt) {
  var webpackConfig = require('./webpack.config.js');
  grunt.initConfig({
    dirs:{
      theme:'../',
      lib:'./lib/',
      assets:'assets/',
      js:'./js/',
      css:'./css/',
      scss:'./scss/'
    },
    bower: {
        install: {
            options: {
                targetDir: './lib',
                layout: 'byComponent'
            }
        }
    },
    copy: {
      misc: {
        files: [{
            src: 'bourbon/**/*',
            cwd: '<%= dirs.lib %>',
            dest: '<%= dirs.scss %>',
            expand: true
        }]
      }
    },
    sass:{
      dev: {
				options: {
					style: 'expanded',
					compass: false,
          sourcemap: false
				},
				files: {
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>availability-grid.css': '<%= dirs.scss %>main.scss'
				}
			}
    },
    postcss: {
      options: {
        map: true, // inline sourcemaps

        // or
        map: {
            inline: false, // save all sourcemaps as separate files...
            annotation: '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>maps/' // ...to the specified directory
        },

        processors: [
          require('pixrem')(), // add fallbacks for rem units
          require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
          //require('cssnano')() // minify the result
        ]
      },
      dist: {
        src: '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>*.css'
      }
    },
    cssmin:{
      ship: {
        options:{
          report:'gzip'
        },
        files: {
            '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>availability-grid.min.css': '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>availability-grid.css'
        }
      },
    },
    webpack:{
      options:webpackConfig,
      dist:{

      }
    },
    umd: {
      all:{
        options:{
          src: '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>availability-grid.js'
        }
      }
    },
    uglify: {
      js: {
        options:{report:"gzip"},
        files: {
          '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>availability-grid.min.js': '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>availability-grid.js'
        }
      }
    },
    watch: { /* trigger tasks on save */
      options: {
          livereload: true
      },
      scss: {
          options: {
              livereload: false
          },
          files: '<%= dirs.scss %>**/*.scss',
          tasks: ['sass','postcss']
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-umd');

  grunt.registerTask('build',['sass','postcss','cssmin','webpack','uglify']);
};
