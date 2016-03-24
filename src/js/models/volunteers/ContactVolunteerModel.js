var BaseViewModel = require('../BaseViewModel')
var ajax = require('../../ajax')
var browser = require('../../browser')
var cookies = require('../../cookies')
var endpoints = require('../../api-endpoints')
var getUrlParam = require('../../get-url-parameter')
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

  ko.validation.init({
    insertMessages: true,
    decorateInputElement: true,
    parseInputAttributes: true,
    errorMessageClass: 'form__error',
    errorElementClass: 'form__input--error'
  }, true)

  self.submit = function () {
    if (self.formModel.isValid()) {
      browser.loading()
      var endpoint = self.endpointBuilder.volunteers(getUrlParam.parameter('id')).build() + '/contact-requests'
      var headers = self.headers(cookies.get('session-token'))
      var payload = {
        'Message': self.formModel().message()
      }
      ajax
        .post(endpoint, headers, payload)
        .then(function (res) {
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
