var ko = require('knockout')

var adminurls = require('../../admin-urls')
var ajax = require('../../ajax')
var BaseViewModel = require('../BaseViewModel')
var browser = require('../../browser')
var getUrlParameter = require('../../get-url-parameter')
var Need = require('../Need')

function EditServiceProviderNeed () {
  var self = this
  self.need = ko.observable()

  var providerId = getUrlParameter.parameter('providerId')
  var needId = getUrlParameter.parameter('needId')

  self.saveNeed = function (need) {
    var redirect = adminurls.serviceProviders + '?key=' + providerId
    browser.redirect(redirect)
  }

  browser.loading()

  var endpoint = self.endpointBuilder.serviceProviders(providerId).needs(needId).build()

  ajax
    .get(endpoint)
    .then((result) => {
      var need = new Need(result.data)
      need.addListener(self)
      self.need(need)
      browser.loaded()
    }, function (error) {
      self.handleError(error)
    })
}

EditServiceProviderNeed.prototype = new BaseViewModel()

module.exports = EditServiceProviderNeed
