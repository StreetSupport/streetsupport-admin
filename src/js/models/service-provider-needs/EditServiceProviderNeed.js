var ko = require('knockout')
var Need = require('../Need')
var BaseViewModel = require('../BaseViewModel')
var browser = require('../../browser')
var adminurls = require('../../admin-urls')
var getUrlParameter = require('../../get-url-parameter')
var ajax = require('../../ajax')
var cookies = require('../../cookies')

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
  var headers = self.headers(cookies.get('session-token'))

  ajax
    .get(endpoint, headers)
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
