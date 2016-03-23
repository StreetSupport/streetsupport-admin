var BaseViewModel = require('../BaseViewModel')
var ajax = require('../../ajax')
var browser = require('../../browser')
var cookies = require('../../cookies')
var endpoints = require('../../api-endpoints')
var ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!

var ContactVolunteerModel = function () {
  var self = this
  self.isFormSubmitSuccessful = ko.observable(false)
  self.isFormSubmitFailure = ko.observable(false)
  self.formModel = ko.validatedObservable({
    message: ko.observable().extend({ required: true })
  })
  self.fieldErrors = ko.validation.group(self.formModel)
  self.apiErrors = ko.observableArray()

  self.submit = function () {
    if (self.formModel.isValid()) {
      browser.loading()
      ajax.post(
        endpoints.contactVolunteer,
        self.headers(cookies.get('session-token')),
        {
          'Message': self.formModel().message()
        }
      ).then(function (res) {
        browser.loaded()
        if (res.status === 'error') {
          self.isFormSubmitFailure(true)
          self.showErrors(res)
        } else {
          self.isFormSubmitSuccessful(true)
        }
      }, function (res) {
        self.handleServerError(res)
      })
    } else {
      self.fieldErrors.showAllMessages()
    }
  }
}

ContactVolunteerModel.prototype = new BaseViewModel()

module.exports = ContactVolunteerModel
