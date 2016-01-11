var ajax = require('basic-ajax')
var endpoints = require('../api-endpoints')
var adminUrls = require('../admin-urls')
var browser = require('../browser')
var cookies = require('../cookies')
var ko = require('knockout')

function LoginModel () {
  var self = this

  self.username = ko.observable('')
  self.password = ko.observable('')
  self.message = ko.observable('')
  self.isSubmitting = false

  self.submit = function () {
    var self = this
    if (!self.isSubmitting) {
      self.isSubmitting = true
      self.message('Loading, please wait')
      ajax.postJson(endpoints.createSession, {
        'username': self.username(),
        'password': self.password()
      })
      .then(function (result) {
        cookies.set('session-token', result.json.sessionToken)
        browser.redirect(adminUrls.dashboard)
      }, function (error) {
        var response = JSON.parse(error.response)
        self.message(response.messages.join('<br />'))
        self.isSubmitting = false
      })
    }
  }
}

module.exports = LoginModel
