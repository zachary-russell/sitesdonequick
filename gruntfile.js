module.exports = function(grunt) {

	// load all grunt tasks in package.json matching the `grunt-*` pattern
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		githooks: {
			all: {
				'pre-commit': 'default'
			}
		},

		csscomb: {
			dist: {
				files: [{
					expand: true,
					cwd: '',
					src: ['*.css'],
					dest: ''
				}]
			}
		},

		sass: {
			dist: {
				options: {
					style: 'expanded',
					lineNumbers: true,
					sourcemap : 'auto',
					noCache   : true
				},
				files: {
					'style.css': 'sass/style.scss'
				}
			}
		},

		autoprefixer: {
			options: {
				browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
			},
			dist: {
				src:  'style.css'
			}
		},

		cmq: {
			options: {
				log: false
			},
			dist: {
				files: {
					'style.css': 'style.css'
				}
			}
		},

		cssmin: {
			minify: {
				expand: true,
				cwd: '',
				src: ['*.css', '!*.min.css'],
				dest: '',
				ext: '.min.css'
			}
		},

		uglify: {
			build: {
				options: {
					mangle: false
				},
				files: [{
					expand: true,
					cwd: 'js/',
					src: ['*.js', '!*.min.js', '!/*.js'],
					dest: 'js/min/',
					ext: '.min.js'
				}]
			}
		},

		watch: {

			options: {
				livereload: true
			},

			scripts: {
				files: ['js/**/*.js'],
				tasks: ['javascript'],
				options: {
					spawn: false,
				},
			},

			sass: {
				files: ['sass/partials/*.scss', 'sass/*.scss'],
				tasks : ['sass', 'autoprefixer', 'cssmin'],
				options: {
					spawn: false,
					livereload: true,
				},
			},

		},

		clean: {
			js: ['js/project*', 'js/**/*.min.js'],
			css: ['style.css', 'style.min.css']
		},

		update_submodules: {

			default: {
				options: {
					// default command line parameters will be used: --init --recursive
				}
			},
			withCustomParameters: {
				options: {
					params: '--force' // specifies your own command-line parameters
				}
			},

		}

	});

	// A very basic default task.
	grunt.registerTask ( 'default', ['clean', 'sass', 'autoprefixer', 'uglify', 'watch'] );

};
