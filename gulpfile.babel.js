'use strict'

// Load global config and gulp
var config  = require(__dirname + '/tasks/config/foley.json')
var argv    = require('yargs').argv
var gulp    = require('gulp')
var plumber = require('gulp-plumber')
var debug   = require('gulp-debug')
var gulpif  = require('gulp-if')

// Load modules to run tasks from files
var requireDir   = require('require-dir')
var tasks        = requireDir(__dirname + '/tasks')
var runSequence  = require('run-sequence')

// Specific task modules
var browserSync = require('browser-sync')
var watch       = require('gulp-watch')

// Assets task. Metalsmith needs to run first
gulp.task('assets', function (callback) {
  runSequence(
    'metalsmith',
    ['svgicon', 'scss', 'webpack', 'img', 'copy', 'html'],
    callback
  )
})

// BrowserSync reload task
gulp.task('reload', function (callback) {
  browserSync.reload()
  callback()
})

// Rebuild JS task.
// We need to manually reload BrowserSync after
gulp.task('rebuildJs', function (callback) {
  runSequence(
    'webpack',
    'reload',
    callback
  )
})

// Rebuild Metalsmith task. Needed because Metalsmith doesn't do incremental builds
// We need to manually reload BrowserSync after
gulp.task('rebuildMetalsmith', function (callback) {
  runSequence(
    'assets',
    'reload',
    callback
  )
})

gulp.task('test', function (callback) {
  runSequence(
    'run-jasmine',
    callback
  )
})

// Watch task
gulp.task('watch', function (callback) {
  gulp.watch(config.paths.scss + '**/*.scss', ['scss'])
  gulp.watch(config.paths.js + '**/*.js', ['rebuildJs', 'test'])
  gulp.watch(config.paths.img + '{,**/}*.{png,jpg,gif,svg}', ['img'])
  gulp.watch(config.paths.icons + '**/*.svg', ['svgicon'])
  gulp.watch([config.paths.pages + '**/*.hbs', config.paths.partials + '**/*.hbs'], ['rebuildMetalsmith'])
  gulp.watch(config.paths.tests + '**/*.js', ['test'])
})

// Watch task - just tests
gulp.task('devWatch', function (callback) {
  gulp.watch(config.paths.js + '**/*.js', ['test'])
  gulp.watch(config.paths.tests + '**/*.js', ['test'])
})

// Build website with development assets and run server with live reloading
gulp.task('default', function (callback) {
  runSequence(
    'test',
    'clean',
    'assets',
    'browsersync',
    'watch',
    callback
  )
})

// run tests
gulp.task('dev', function (callback) {
  runSequence(
    'test',
    'devWatch',
    callback
  )
})

// Build website, either with development or minified assets depending on flag
gulp.task('deploy', function (callback) {
  runSequence(
    'test',
    'clean',
    'assets',
    'crticalcss',
    callback
  )
})
