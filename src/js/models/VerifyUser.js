var ko = require('knockout')
var cookies = require('../cookies')
var getUrlParameter = require('../get-url-parameter')
var ajax = require('basic-ajax')
var BaseViewModel = require('./BaseViewModel')


function VerifyUser () {
  var self = this

  self.username = ko.observable()
  self.password = ko.observable()

  self.save = function () {
    var endpoint = self.endpointBuilder.unverifiedUsers().build()
    var payload = {
      'UserName': self.username(),
      'Password': self.password(),
      'VerificationToken': getUrlParameter.parameter('id'),
    }
    ajax
      .post(endpoint, self.headers(cookies.get('session-token')), JSON.stringify(payload))
      .then(function (result) {
        self.message('User verified. You can now log in.')
        self.clearErrors()
      }, function (error) {
        self.setErrors(error)
      })
  }
}

VerifyUser.prototype = new BaseViewModel()

module.exports = VerifyUser
