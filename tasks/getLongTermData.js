import config from '../foley.json'
import gulp from 'gulp'
import fs from 'fs'
import jeditor from 'gulp-json-editor'
import request from 'request'
import source from 'vinyl-source-stream'
import streamify from 'gulp-streamify'
import replace from 'gulp-replace'

const endpoints = require('../src/js/api-endpoints')

const outputs = {
  serviceCategories: 'service-categories.js',
  accomCategories: 'accommodation-categories.js',
  supportTypes: 'support-types.js',
  supportedCities: 'supported-cities.js'
}

/* calls API and generates static data */
gulp.task('service-categories', (callback) => {
  return request(endpoints.getServiceCategories)
    .pipe(source(`${config.paths.generatedData}${outputs.serviceCategories}`))
    .pipe(streamify(jeditor(function (cats) {
      return cats
        .filter((c) => c.key !== 'accom') // don't include accommodation as a normal service category...
        .map(function (c) {
          return {
            key: c.key,
            sortOrder: c.sortOrder,
            name: c.name,
            subCategories: c.subCategories.map(function (sc) {
              return {
                key: sc.key,
                name: sc.name
              }
            })
          }
        })
        .sort((a, b) => {
          if (a.sortOrder > b.sortOrder) return -1
          if (a.sortOrder < b.sortOrder) return 1
          return 0
        })
    })))
    .pipe(replace(/^\[/, 'export const categories = ['))
    .pipe(gulp.dest('./'))
})

gulp.task('accom-subcategories', (callback) => {
  return request(endpoints.getServiceCategories)
    .pipe(source(`${config.paths.generatedData}${outputs.accomCategories}`))
    .pipe(streamify(jeditor(function (cats) {
      return cats
        .filter((c) => c.key === 'accom')[0]
        .subCategories
    })))
    .pipe(replace(/^\[/, 'export const categories = ['))
    .pipe(gulp.dest('./'))
})

gulp.task('support-types', (callback) => {
  const body = `export const supportTypes = [
        { key: 'alcohol', name: 'Alcohol' },
        { key: 'domestic violence', name: 'Domestic Violence' },
        { key: 'mental health', name: 'Mental Health' },
        { key: 'physical health', name: 'Physical Health' },
        { key: 'substances', name: 'Drug Dependency' }
      ]`

  fs.writeFile(`${config.paths.generatedData}${outputs.supportTypes}`, body, function (err) {
    if (err) {
      return console.log(err)
    }
  })

  return callback()
})

gulp.task('supported-cities', (callback) => {
  return request(endpoints.cities)
    .pipe(source(`${config.paths.generatedData}${outputs.supportedCities}`))
    .pipe(streamify(jeditor(function (cities) {
      return cities.map(function (c) {
        return {
          id: c.key,
          findHelpId: c.key,
          name: c.name,
          latitude: c.latitude,
          longitude: c.longitude,
          isOpenToRegistrations: c.isOpenToRegistrations,
          isPublic: c.isPublic
        }
      })
    })))
    .pipe(replace('[', 'export const cities = ['))
    .pipe(gulp.dest('./'))
})

gulp.task('getLongTermData', ['service-categories', 'accom-subcategories', 'supported-cities', 'support-types'])
