module.exports = function(grunt){
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  var pkg = grunt.file.readJSON('package.json');

	grunt.initConfig({
    pkg: pkg,

    // HTML Validation options
    htmlhint: {
			build: {
				options: {
					'tag-pair': true,
					'tagname-lowercase': true,
					'attr-lowercase': true,
					'attr-value-double-quotes': true,
					'doctype-first': true,
					'spec-char-escape': true,
					'id-unique': true,
					'style-disabled': true
				},
				src: ['source/**/*.html'] // which pages to validate
			}
		},

    uglify: {
      compress: {
        files: {
          'dist/jquery.js' : 'bower_components/jquery/dist/jquery.js',
          'dist/skip-link.min.js': 'source/skip-link.js'
        }
      }
    },

    sass: {
      options: {
        outputStyle: 'nested',
        imagePath: 'images',
        precision: 5,
      },
      dev: {
        files: {
          'dist/skip-link.css' : 'source/skip-link.scss'
        }
      }
    },

    copyFiles: '**/*.{eot,svg,ttf,woff,pdf,scss,html,js}',
    copy: {
      target: {
        files: [
          // includes files within path
          {expand: true, cwd: 'source/', src: ['<%= copyFiles %>'], dest: 'dist', filter: 'isFile'}
        ]
      }
    },

    // Will Automatically insert the correct prefixes for CSS properties. Just write plain CSS.
    autoprefixer: {
      options: {
        browsers: ['last 2 version']
      },
      prod: {
        src: 'dist/**/*.css'
      },
      dev: {
        src: 'dist/**/*.css'
      },
    },

    // Watch options: what tasks to run when changes to files are saved
    watch: {
      options: {
        livereload: true
      },
      css: {
        files: ['source/**/*.scss'],
        tasks: ['css'] // Compile with Compass when Sass changes are saved
      },
			html: {
        files: ['source/**/*.html'], // Watch for changes to these html files to run htmlhint (validation) task
				tasks: ['html']
			},
      copy: {
        files: ['source/<%= copyFiles %>'],
        tasks: ['copy']
      }
		}
	});

  /**
   * CSS tasks
   */
  grunt.registerTask('css', [
    'sass',
    'autoprefixer:dev'
  ]);

  /**
   * JavaScript
   */
  grunt.registerTask('js', [
    'uglify:compress'
  ]);

  /**
   * HTML tasks
   */
  grunt.registerTask('html', [
    'htmlhint'
  ]);

  /**
   * Dev task
   */
  grunt.registerTask('dev',[
    'css',
    'html',
    'js',
    'copy'
  ]);

  /**
   * Production Task
   */
  var prodTasks = [];
  prodTasks.push('sass');
  prodTasks.push('autoprefixer:prod');
  prodTasks.push('htmlhint');
  prodTasks.push('copy');

  /**
   * Default Tasks
   */
  grunt.registerTask('default',['dev','watch']);

  /**
   * Staging Tasks
   */
  grunt.registerTask('staging',['dev']);

};
