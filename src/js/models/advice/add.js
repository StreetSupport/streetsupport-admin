const ko = require('knockout')

const ajax = require('../../ajax')
const auth = require('../../auth')
const browser = require('../../browser')
const endpoints = require('../../api-endpoints')
const htmlEncode = require('htmlencode')

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
  self.parentScenarioKey = ko.observable()

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
      parentScenario: self.parentScenarios().find((ps) => ps.key === self.parentScenarioKey())
    }
    ajax
      .post(endpoints.faqs, payload)
      .then((result) => {
        if (result.statusCode === 201) {
          self.itemCreated(true)
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
    self.getParentScenarios()
  }

  self.getParentScenarios = () => {
    ajax
      .get(`${endpoints.parentScenarios}`)
      .then((result) => {
        self.parentScenarios(result.data
          .map(p => {
            return {
              key: p.key,
              name: htmlEncode.htmlDecode(p.name)
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
