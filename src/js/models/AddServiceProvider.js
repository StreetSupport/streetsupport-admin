var ko = require('knockout')
var ajax = require('../ajax')
var adminUrls = require('../admin-urls')
var cookies = require('../cookies')
var browser = require('../browser')
var BaseViewModel = require('./BaseViewModel')

function AddServiceProvider () {
  var self = this
  self.name = ko.observable('')
  self.cityId = ko.observable()
  self.cities = ko.observableArray()

  self.save = function () {
    browser.loading()
    var endpoint = self.endpointBuilder.serviceProviders().build()
    var payload = {
      'Name': self.name(),
      'AssociatedCity': self.cityId()
    }
    ajax
      .post(endpoint, self.headers(cookies.get('session-token')), payload)
      .then(function (result) {
        browser.loaded()
        if (result.statusCode === 201) {
          browser.redirect(adminUrls.dashboard)
        } else {
          self.handleError(result)
        }
      }, function (error) {
        self.handleError(error)
      })
  }

  self.init = () => {
    browser.loading()
    let endpoint = self.endpointBuilder.cities().build()
    ajax
      .get(endpoint)
      .then((result) => {
        self.cities(result.data)
        browser.loaded()
      }, (error) => {
        self.handleError(error)
      })
  }

  self.init()
}

AddServiceProvider.prototype = new BaseViewModel()

module.exports = AddServiceProvider
