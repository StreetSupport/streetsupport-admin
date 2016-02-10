var ajax = require('basic-ajax')
var adminUrls = require('../../admin-urls')
var browser = require('../../browser')
var cookies = require('../../cookies')
var ko = require('knockout')
var BaseViewModel = require('../BaseViewModel')

function ResetPasswordModel () {
  var self = this

  self.email = ko.observable('')
  self.isSubmissionSuccessful = ko.observable(false)
  self.isSubmitting = false

  self.submit = function () {
    var self = this
    if (!self.isSubmitting) {
      self.isSubmitting = true
      self.message('Loading, please wait')
      ajax.post(self.endpointBuilder.resetPassword().build(), 
      self.headers(cookies.get('session-token')),
      JSON.stringify({
        'Email': self.email(),
      }))
      .then(function (result) {
        self.isSubmissionSuccessful(true)
      }, function (error) {
        self.handleError(error)
        self.isSubmitting = false
      })
    }
  }

  self.dataLoaded()
}

ResetPasswordModel.prototype = new BaseViewModel()

module.exports = ResetPasswordModel
