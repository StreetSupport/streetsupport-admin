const ko = require('knockout')

const ajax = require('../../ajax')
const browser = require('../../browser')
const endpoints = require('../../api-endpoints')

const BaseViewModel = require('../BaseViewModel')

const Model = function () {
  const self = this

  self.itemCreated = ko.observable(false)
  self.name = ko.observable()
  self.body = ko.observable()
  self.tags = ko.observable('')
  self.sortPosition = ko.observable()

  self.save = function () {
    browser.loading()
    const payload = {
      name: self.name(),
      body: self.body(),
      tags: self.tags().length
        ? self.tags().split(',').map((t) => t.trim())
        : [],
      sortPosition: self.sortPosition()
    }
    ajax
      .post(endpoints.parentScenarios, payload)
      .then((result) => {
        if (result.statusCode === 201) {
          self.clearErrors()
          self.itemCreated(true)
        } else {
          self.handleError(result)
        }
        browser.loaded()
      }, (err) => {
        self.handleError(err)
      })
  }
}

Model.prototype = new BaseViewModel()

module.exports = Model
