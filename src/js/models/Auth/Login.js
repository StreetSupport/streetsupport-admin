var ajax = require('../../ajax')
var adminUrls = require('../../admin-urls')
var browser = require('../../browser')
var cookies = require('../../cookies')
var ko = require('knockout')
var BaseViewModel = require('../BaseViewModel')

function LoginModel () {
  var self = this

  self.username = ko.observable('')
  self.password = ko.observable('')
  self.isSubmitting = false

  var handleSubmitError = function(error) {
    self.showErrors(error)
    self.message('')
    self.isSubmitting = false
  }

  self.submit = function () {
    var self = this
    if (!self.isSubmitting) {
      self.isSubmitting = true
      self.message('Loading, please wait')
      ajax.postJson(self.endpointBuilder.sessions().build() + '/create', {
        'username': self.username(),
        'password': self.password()
      })
      .then(function (result) {
        if (result.status === 'error') {
          handleSubmitError(result)
        }
        cookies.set('session-token', result.json.sessionToken)
        cookies.set('auth-claims', result.json.authClaims)
        browser.redirect(adminUrls.redirector)
      }, function (error) {
        handleSubmitError(error)
      })
    }
  }
}

LoginModel.prototype = new BaseViewModel()

module.exports = LoginModel
