const ko = require('knockout')
const htmlencode = require('htmlencode')

const ajax = require('../../ajax')
const auth = require('../../auth')
const browser = require('../../browser')
const querystring = require('../../get-url-parameter')
const endpoints = require('../../api-endpoints')

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
  self.parentScenarios = ko.observableArray([])
  self.parentScenarioId = ko.observable()

  self.save = function () {
    browser.loading()
    const payload = {
      title: self.title(),
      body: self.body(),
      tags: self.tags().length
        ? self.tags().split(',').map((t) => t.trim())
        : [],
      locationKey: self.locationKey(),
      sortPosition: self.sortPosition(),
      parentScenarioId: self.parentScenarioId()
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
    self.locations(auth.getLocationsForUser([{ id: 'general', name: 'General Advice' }]))
    browser.loading()
    self.getParentScenarios()

    // We generate this for retrieving the not cached item
    let syntaxSugar = new Date().getTime()

    ajax
      .get(self.endpointBuilder.faqs(querystring.parameter('id')).build() + `?unique=${syntaxSugar}`)
      .then((result) => {
        self.title(htmlencode.htmlDecode(result.data.title))
        self.body(htmlencode.htmlDecode(result.data.body))
        self.locationKey(result.data.locationKey)
        self.tags(result.data.tags.join(', '))
        self.sortPosition(result.data.sortPosition)
        if (result.data.parentScenarioId !== null) {
          self.parentScenarioId(result.data.parentScenarioId)
        } else {
          self.parentScenarioId(null)
        }
        browser.loaded()
      }, (err) => {
        self.handleError(err)
      })
  }

  self.getParentScenarios = () => {
    ajax
      .get(`${endpoints.parentScenarios}`)
      .then((result) => {
        self.parentScenarios(result.data
          .map(p => {
            return {
              id: p.id,
              name: htmlencode.htmlDecode(p.name)
            }
          })
        )
      }, () => {
        self.handleServerError()
      })
  }
}

Model.prototype = new BaseViewModel()

module.exports = Model
