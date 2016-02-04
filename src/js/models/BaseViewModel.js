var ko = require('knockout')
var Endpoints = require('../endpoint-builder')
var browser = require('../browser')
var adminUrls = require('../admin-urls')
var _ = require('lodash')

function BaseViewModel () {
  var self = this
  self.message = ko.observable()
  self.errors = ko.observableArray()
  self.hasErrors = ko.computed(function () {
    return self.errors().length > 0
  }, self)

  self.endpointBuilder = new Endpoints()

  self.headers = function (sessionToken) {
    return {
      'content-type': 'application/json',
      'session-token': sessionToken
    }
  }

  self.dataLoaded = function () {
    browser.dataLoaded()
  }

  self.clearErrors = function () {
    self.errors([])
  }

  self.setErrors = function (error) {
    self.errors(JSON.parse(error.response).messages)
  }

  self.handleError = function (error) {
    if (error.status === 401) {
      browser.redirect(adminUrls.redirector)
    } else {
      self.message('')
      self.setErrors(error)
    }
  }
}

module.exports = BaseViewModel
