'use strict'

// Load global config and gulp
import config from './foley.json'
import gulp from 'gulp'

// Load modules to run tasks from files
import runSequence from 'gulp4-run-sequence'
const tasks = require('./tasks') // eslint-disable-line

// Watch task
gulp.task('watch', () => {
  gulp.watch(config.paths.scss + '**/*.scss', gulp.series(['scss']))
  gulp.watch(config.paths.spec + '**/*[Ss]pec.js', gulp.series(['jasmine', 'specsstandardlint']))
  gulp.watch(config.paths.js + '**/*.js', gulp.series(['jasmine', 'standardlint', 'webpack']))
  gulp.watch(config.paths.img + '{,**/}*.{png,jpg,gif,svg}', gulp.series(['img']))
  gulp.watch(config.paths.icons + '**/*.svg', gulp.series(['svgsprite']))
  gulp.watch([config.paths.fonts + '**/*', config.paths.files + '**/*'], gulp.series(['copy']))
  gulp.watch([config.paths.data + '**/*.json', config.paths.layouts + '**/*.hbs', config.paths.pages + '**/*.hbs', config.paths.partials + '**/*.hbs'], gulp.series(['metalsmith']))
})

// jsdev Watch task
gulp.task('jsdevwatch', () => {
  gulp.watch(config.paths.spec + '**/*[Ss]pec.js', gulp.series(['jasmine', 'specsstandardlint']))
  gulp.watch(config.paths.js + '**/*.js', gulp.series(['jasmine', 'standardlint']))
})

// Build website, either with development or minified assets and run server with live reloading
gulp.task('default', (callback) => {
  runSequence(
    'getLongTermData',
    'jasmine',
    'standardlint',
    'clean',
    'cachebusting',
    'metalsmith',
    ['htmlmin', 'svgsprite', 'scss', 'webpack', 'img', 'copy'],
    ['browsersync', 'watch'],
    callback
  )
})

// Build website, either with development or minified assets depending on flag
gulp.task('deploy', (callback) => {
  runSequence(
    'getLongTermData',
    'jasmine',
    'standardlint',
    'clean',
    'cachebusting',
    'metalsmith',
    ['htmlmin', 'svgsprite', 'scss', 'webpack', 'img', 'copy'],
    'crticalcss',
    callback
  )
})

// Run tests and watch js/spec files
gulp.task('jsdev', (callback) => {
  runSequence(
    // 'getLongTermData',
    'jasmine',
    'standardlint',
    'specsstandardlint',
    'jsdevwatch',
    callback
  )
})

// Run the audit task to check code standards
gulp.task('auditcode', (callback) => {
  runSequence(
    'scsslint',
    'standardlint',
    callback
  )
})