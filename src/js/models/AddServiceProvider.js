var ko = require('knockout')
var ajax = require('../ajax')
var adminUrls = require('../admin-urls')
var cookies = require('../cookies')
var browser = require('../browser')
var BaseViewModel = require('./BaseViewModel')

import { cities } from '../../data/generated/supported-cities'

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

  self.cities(cities)
}

AddServiceProvider.prototype = new BaseViewModel()

module.exports = AddServiceProvider
