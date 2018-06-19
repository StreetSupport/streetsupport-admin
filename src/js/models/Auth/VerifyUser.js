var ko = require('knockout')
var browser = require('../../browser')
var cookies = require('../../cookies')
var getUrlParameter = require('../../get-url-parameter')
var ajax = require('../../ajax')
var BaseViewModel = require('../BaseViewModel')

function VerifyUser () {
  var self = this

  self.username = ko.observable()
  self.password = ko.observable()
  self.userCreated = ko.observable(false)

  self.save = function () {
    browser.loading()
    var endpoint = self.endpointBuilder.verifiedUsers().build()
    var payload = {
      'UserName': self.username(),
      'Password': self.password(),
      'VerificationToken': getUrlParameter.parameter('id')
    }
    ajax
      .post(endpoint, payload)
      .then(function (result) {
        if (result.statusCode === 201) {
          self.message('User verified. You can now log in.')
          self.clearErrors()
          self.userCreated(true)
        } else {
          self.showErrors(result)
        }
        browser.loaded()
      }, function (error) {
        self.handleError(error)
      })
  }
}

VerifyUser.prototype = new BaseViewModel()

module.exports = VerifyUser
