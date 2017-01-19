var ko = require('knockout')
var Endpoints = require('../endpoint-builder')
var browser = require('../browser')
var adminUrls = require('../admin-urls')

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

  self.clearErrors = function () {
    self.errors([])
  }

  self.setErrors = function (error) { // deprecated
    if (error.response !== undefined) {
      self.errors(JSON.parse(error.response).messages)
    } else {
      self.errors(error.data.messages)
    }
  }

  self.showErrors = function (error) {
    self.errors(error.data.messages)
  }

  self.handleError = function (result) {
    if (result.statusCode === 401 || result.statusCode === 403) {
      browser.redirect(adminUrls.redirector)
    } else {
      self.message('')
      self.setErrors(result)
      browser.scrollTo('.form-feedback')
    }
  }

  self.handleServerError = function () {
    browser.redirect(adminUrls.serverError)
  }
}

module.exports = BaseViewModel
