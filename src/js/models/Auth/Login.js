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

  var handleSubmitError = function (error) {
    self.showErrors(error)
    self.message('')
    self.isSubmitting = false
  }

  self.submit = function () {
    var self = this
    if (!self.isSubmitting) {
      self.isSubmitting = true
      self.message('Loading, please wait')
      ajax.post(self.endpointBuilder.sessions().build() + '/create',
        {},
        {
          'username': self.username(),
          'password': self.password()
        }, true)
      .then(function (result) {
        if (result.status === 'error') {
          handleSubmitError(result)
        } else {
          cookies.set('session-token', result.data.sessionToken)
          cookies.set('auth-claims', result.data.authClaims)
          browser.redirect(adminUrls.redirector)
        }
      }, function (error) {
        self.handleServerError(error)
      })
    }
  }
}

LoginModel.prototype = new BaseViewModel()

module.exports = LoginModel
