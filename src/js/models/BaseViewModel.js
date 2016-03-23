var ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!
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

  self.dataLoaded = function () {
    browser.dataLoaded()
  }

  self.clearErrors = function () {
    self.errors([])
  }

  self.setErrors = function (error) { // deprecated
    self.errors(JSON.parse(error.response).messages)
  }

  self.showErrors = function (error) {
    self.errors(error.data.messages)
  }

  self.handleError = function (error) {
    if (error.status === 401 || error.status === 403) {
      browser.redirect(adminUrls.redirector)
    } else {
      self.message('')
      self.setErrors(error)
    }
  }

  self.handleServerError = function () {
    browser.redirect(adminUrls.serverError)
  }

  self.configureValidation = function () {
    ko.validation.init({
      insertMessages: true,
      decorateInputElement: true,
      parseInputAttributes: true,
      errorMessageClass: 'form__error',
      errorElementClass: 'form__input--error'
    }, true)
  }
}

module.exports = BaseViewModel
