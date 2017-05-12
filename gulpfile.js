'use strict';

//* Store paths
var PATHS = {
	js: './js/',
	sass: './sass/',
	build: {
		js: './js/min/',
		css: './'
	}
}

//* Load and define dependencies
var gulp = require( 'gulp' );
var sass = require( 'gulp-ruby-sass' );
var uglify = require( 'gulp-uglify' );
var rename = require( 'gulp-rename' );
var sort = require( 'gulp-sort' );
var zip = require( 'gulp-zip' );
var browserSync = require( 'browser-sync' );
var reload = browserSync.reload;


var taskLoader = [ 'scripts', 'sass', 'watch' ];

//* Gulp task to minify and output JS files to filename.min.js
gulp.task( 'scripts', function() {

	gulp.src( [ PATHS.js + '*.js' ] )
		.pipe( uglify() )
		.pipe( rename({ extname: '.min.js' }))
		.pipe( gulp.dest( PATHS.build.js ) );

});

//* Gulp task to compile, minify, and output stylesheet in place of old uncompressed version
gulp.task( 'sass', function() {

	sass( PATHS.sass + 'style.scss', { style: 'nested' })
		.pipe( gulp.dest( './' ) );
	sass( PATHS.sass + 'style.scss', { style: 'compressed' })
		.pipe( rename({ extname: '.min.css' }))
		.pipe( gulp.dest( './' ) );

});

gulp.task('browserSync', function() {
 	var files = [
 		PATHS.sass
 	];
 	browserSync.init( files, {
 		open: false,
 		proxy: "local.dev",
 		injectChanges: true,
 		watchOptions: { debounceDelay: 1000 }
 	});
 })

gulp.task('watch', function() {
	gulp.watch(PATHS.js + '**/*.js', ['scripts']);
	gulp.watch(PATHS.sass + '**/*.scss', ['sass']);
});

//* ZIP theme
gulp.task( 'package-theme', function() {

	gulp.src( ['./**/*', '!./node_modules/**/*', '!./gruntfile.js', '!./grunt.package.json', '!./gulpfile.js', '!./package.json', '!./config.codekit' ] )
		.pipe( zip( __dirname.split("/").pop() + '.zip' ) )
		.pipe( gulp.dest( '../' ) );

});

gulp.task( 'dev-package-theme', function() {

	gulp.src( ['./**/*', '!./node_modules/**/*', '!./node_modules' ] )
			.pipe( zip( __dirname.split("/").pop() + '.zip' ) )
			.pipe( gulp.dest( '../' ) );

});

//* Load tasks
gulp.task( 'default', taskLoader );
