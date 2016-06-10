var ajax = require('../../ajax')
var browser = require('../../browser')
var cookies = require('../../cookies')
var ko = require('knockout')
var BaseViewModel = require('../BaseViewModel')

function RequestResetPasswordModel () {
  var self = this

  self.email = ko.observable('')
  self.isSubmissionSuccessful = ko.observable(false)
  self.isSubmitting = false

  self.submit = function () {
    var self = this
    if (!self.isSubmitting) {
      browser.loading()
      self.isSubmitting = true
      self.message('Loading, please wait')
      ajax.post(self.endpointBuilder.resetPassword().build(),
        self.headers(cookies.get('session-token')),
        {
          'Email': self.email()
        })
      .then(function (result) {
        self.isSubmissionSuccessful(true)
        browser.loaded()
      }, function (error) {
        self.handleError(error)
        self.isSubmitting = false
      })
    }
  }
}

RequestResetPasswordModel.prototype = new BaseViewModel()

module.exports = RequestResetPasswordModel
