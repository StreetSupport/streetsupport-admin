var ajax = require('basic-ajax')
var endpoints = require('../api-endpoints')
var adminUrls = require('../admin-urls')
var ko = require('knockout')

function DashboardModel () {
}

DashboardModel.prototype.init = function () {
  var self = this
  // if (!self.isSubmitting) {
  //   self.isSubmitting = true
  //   self.message('Loading, please wait')
  //   ajax.postJson(endpoints.createSession, {
  //     'username': self.username(),
  //     'password': self.password()
  //   })
  //   .then(function (result) {
  //     cookies.set('session-token', result.json.sessionToken)
  //     browser.redirect(adminUrls.dashboard)
  //   }, function (error) {
  //     var response = JSON.parse(error.response)
  //     self.message(response.message)
  //     self.isSubmitting = false
  //   })
  // }
}

module.exports = DashboardModel
