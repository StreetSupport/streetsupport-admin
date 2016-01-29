var ajax = require('basic-ajax')
var endpoints = require('../api-endpoints')
var adminUrls = require('../admin-urls')
var browser = require('../browser')
var cookies = require('../cookies')
var ko = require('knockout')
var _ = require('lodash')
var BaseViewModel = require('./BaseViewModel')

function LoginModel () {
  var self = this

  self.username = ko.observable('')
  self.password = ko.observable('')
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
        cookies.set('auth-claims', result.json.authClaims)
        browser.redirect(adminUrls.redirector)
      }, function (error) {
        self.setErrors(error)
        self.isSubmitting = false
      })
    }
  }
}

LoginModel.prototype = new BaseViewModel()

module.exports = LoginModel
