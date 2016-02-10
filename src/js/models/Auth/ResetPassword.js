var ajax = require('basic-ajax')
var adminUrls = require('../../admin-urls')
var browser = require('../../browser')
var cookies = require('../../cookies')
var ko = require('knockout')
var BaseViewModel = require('../BaseViewModel')
var urlParams = require('../../get-url-parameter')

function ResetPasswordModel () {
  var self = this

  self.password = ko.observable('')
  self.password2 = ko.observable('')
  self.isSubmissionSuccessful = ko.observable(false)
  self.isSubmitting = false

  self.submit = function () {
    var self = this
    if (!self.isSubmitting) {

      if(self.password() === self.password2()) {
        self.isSubmitting = true
        self.message('Loading, please wait')
        ajax.put(self.endpointBuilder.resetPassword(urlParams.parameter('id')).build(), 
        self.headers(cookies.get('session-token')),
        JSON.stringify({
          'Password': self.password(),
        }))
        .then(function (result) {
          self.isSubmissionSuccessful(true)
        }, function (error) {
          self.handleError(error)
          self.isSubmitting = false
        })
      } else {
        self.errors(['Passwords must match.'])  
      }
    }
  }

  self.dataLoaded()
}

ResetPasswordModel.prototype = new BaseViewModel()

module.exports = ResetPasswordModel
