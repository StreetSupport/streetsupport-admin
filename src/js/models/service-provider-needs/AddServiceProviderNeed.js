var ko = require('knockout')
var Need = require('../Need')
var BaseViewModel = require('../BaseViewModel')
var browser = require('../../browser')
var adminurls = require('../../admin-urls')
var getUrlParameter = require('../../get-url-parameter')
var ajax = require('basic-ajax')
var Endpoints = require('../../endpoint-builder')
var cookies = require('../../cookies')

function AddServiceProviderNeed () {
  var self = this
  var need = new Need({})
  need.addListener(self)
  self.need = ko.observable()

  self.saveNeed = function (need) {
    var redirect = adminurls.serviceProviders + '?key=' + getUrlParameter.parameter('providerId')
    browser.redirect(redirect)
  }

  var addressEndpoint = self.endpointBuilder.serviceProviders(getUrlParameter.parameter('providerId')).addresses().build()
  ajax.get(addressEndpoint, self.headers(cookies.get('session-token')), JSON.stringify({}))
    .then(function (result) {
      var need = new Need({ postcode: result.json.addresses[0].postcode })
      need.addListener(self)
      self.need(need)
      self.dataLoaded()
    }, function (error) {
      self.handleError(error)
    })

}

AddServiceProviderNeed.prototype = new BaseViewModel()

module.exports = AddServiceProviderNeed
