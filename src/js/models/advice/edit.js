const ko = require('knockout')
const htmlencode = require('htmlencode')

const ajax = require('../../ajax')
const auth = require('../../auth')
const browser = require('../../browser')
const querystring = require('../../get-url-parameter')
import { cities as locations } from '../../../data/generated/supported-cities'

const BaseViewModel = require('../BaseViewModel')

const Model = function () {
  const self = this

  self.itemCreated = ko.observable(false)
  self.title = ko.observable()
  self.body = ko.observable()
  self.tags = ko.observable('')
  self.sortPosition = ko.observable()
  self.locationKey = ko.observable()
  self.locations = ko.observableArray()

  self.save = function () {
    browser.loading()
    const payload = {
      title: self.title(),
      body: self.body(),
      tags: self.tags().length
        ? self.tags().split(',').map((t) => t.trim())
        : [],
      locationKey: self.locationKey(),
      sortPosition: self.sortPosition()
    }
    ajax
      .put(self.endpointBuilder.faqs(querystring.parameter('id')).build(), payload)
      .then((result) => {
        if (result.statusCode === 200) {
          browser.redirect('/advice')
        } else {
          self.handleError(result)
        }
        browser.loaded()
      }, (err) => {
        self.handleError(err)
      })
  }

  self.init = function () {
    const locationsForUser = auth.isCityAdmin()
      ? locations.filter((l) => auth.locationsAdminFor().includes(l.id))
      : [{ id: 'general', name: 'General Advice' }, ...locations]

    self.locations(locationsForUser)

    browser.loading()

    ajax
      .get(self.endpointBuilder.faqs(querystring.parameter('id')).build())
      .then((result) => {
        self.title(htmlencode.htmlDecode(result.data.title))
        self.body(htmlencode.htmlDecode(result.data.body))
        self.locationKey(result.data.locationKey)
        self.tags(result.data.tags.join(', '))
        self.sortPosition(result.data.sortPosition)

        browser.loaded()
      }, (err) => {
        self.handleError(err)
      })
  }
}

Model.prototype = new BaseViewModel()

module.exports = Model
