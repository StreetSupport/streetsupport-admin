var ko = require('knockout')
var ajax = require('../ajax')
var getUrlParameter = require('../get-url-parameter')
var browser = require('../browser')
var BaseViewModel = require('./BaseViewModel')

function AddUser () {
  var self = this
  self.email = ko.observable()
  self.userCreated = ko.observable(false)

  self.save = function () {
    browser.loading()
    var endpoint = self.endpointBuilder.unverifiedUsers().build()
    var payload = {
      Email: self.email(),
      ProviderId: getUrlParameter.parameter('key')
    }
    ajax
      .post(endpoint, payload)
      .then(function (result) {
        if (result.statusCode === 201) {
          self.message('User created.')
          self.userCreated(true)
          self.clearErrors()
        } else {
          self.handleError(result)
        }
        browser.loaded()
      }, function (error) {
        self.handleError(error)
      })
  }
}

AddUser.prototype = new BaseViewModel()

module.exports = AddUser
