// Load global config and gulp
// import config from '../foley.json'
import gulp from 'gulp'

// Specific task modules
import gutil from 'gulp-util'
import browserSync from 'browser-sync'
import webpack from 'webpack'
import webpackConfig from '../webpack.config.js'

// Webpack build task
gulp.task('webpack', gulp.series((callback) => {
  webpack(webpackConfig, function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err)
    }

    gutil.log('webpack', stats.toString({
      colors: true
    }))

    browserSync.reload()
    callback()
  })
}))
