var ko = require('knockout')
var ajax = require('basic-ajax')
var cookies = require('../cookies')
var getUrlParameter = require('../get-url-parameter')
var BaseViewModel = require('./BaseViewModel')

function AddUser () {
  var self = this
  self.email = ko.observable()

  self.save = function () {
    var endpoint = self.endpointBuilder.unverifiedUsers().build()
    var payload = {
      'Email': self.email(),
      'ProviderId': getUrlParameter.parameter('key')
    }
    ajax
      .post(endpoint, self.headers(cookies.get('session-token')), JSON.stringify(payload))
      .then(function (result) {
        self.message('User created.')
        self.errors([])
      }, function (error) {
        self.setErrors(error)
      })
  }
}

AddUser.prototype = new BaseViewModel()

module.exports = AddUser
