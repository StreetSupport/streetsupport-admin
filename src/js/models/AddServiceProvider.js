var ko = require('knockout')
var ajax = require('basic-ajax')
var adminUrls = require('../admin-urls')
var cookies = require('../cookies')
var browser = require('../browser')
var BaseViewModel = require('./BaseViewModel')

function AddServiceProvider () {
  var self = this

  self.name = ko.observable('')

  self.save = function () {
    var endpoint = self.endpointBuilder.serviceProviders().build()
    var payload = {
      'Name': self.name()
    }
    ajax
      .post(endpoint, self.headers(cookies.get('session-token')), JSON.stringify(payload))
      .then(function (result) {
        browser.redirect(adminUrls.dashboard)
      }, function (error) {
        self.handleError(error)
      })
  }
  self.dataLoaded()
}

AddServiceProvider.prototype = new BaseViewModel()

module.exports = AddServiceProvider
