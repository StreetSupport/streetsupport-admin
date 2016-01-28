var ko = require('knockout')
var cookies = require('../cookies')
var Endpoints = require('../endpoint-builder')
var getUrlParameter = require('../get-url-parameter')
var ajax = require('basic-ajax')

function BaseViewModel () {
  var self = this
  self.message = ko.observable()
  self.errors = ko.observableArray()
  self.hasErrors = ko.computed(function () {
    return self.errors().length > 0
  }, self)
  self.endpoints = new Endpoints()
  // self.headers = function(sessionToken) {
  //   'content-type': 'application/json',
  //   'session-token': sessionToken
  // }
}

function VerifyUser () {
  var self = this

  self.username = ko.observable()
  self.password = ko.observable()

  self.save = function () {
    var endpoint = self.endpoints.unverifiedUsers().build()
    var payload = {
      'UserName': self.username(),
      'Password': self.password(),
      'VerificationToken': getUrlParameter.parameter('id'),
    }
    var headers = {
      'content-type': 'application/json',
      'session-token': cookies.get('session-token')
    }
    ajax
      .post(endpoint, headers, JSON.stringify(payload))
      .then(function (result) {
        self.message('User verified. You can now log in.')
        self.errors([])
      }, function (error) {
        self.errors(JSON.parse(error.response).messages)
      })
  }
}

VerifyUser.prototype = new BaseViewModel()

module.exports = VerifyUser
