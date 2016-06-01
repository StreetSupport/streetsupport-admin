var ko = require('knockout')
var Service = require('../Service')
var BaseViewModel = require('../BaseViewModel')
var getUrlParameter = require('../../get-url-parameter')
var cookies = require('../../cookies')
var ajax = require('../../ajax')
var browser = require('../../browser')
var adminUrls = require('../../admin-urls')

function EditServiceProviderService () {
  var self = this

  self.service = ko.observable()

  self.init = function () {
    browser.loading()
    var serviceProviderEndpoint = self.endpointBuilder
      .serviceProviders(getUrlParameter.parameter('providerId'))
      .services(getUrlParameter.parameter('serviceId'))
      .build()

    ajax.get(serviceProviderEndpoint, self.headers(cookies.get('session-token')), {})
    .then(function (result) {
      var data = result.data
      data.serviceProviderId = getUrlParameter.parameter('providerId')
      self.service(new Service(data))
      self.service().addListener(self)
      browser.loaded()
    },
    function (error) {
      self.handleError(error)
    })
  }

  self.serviceSaved = function () {
    browser.redirect(adminUrls.serviceProviders + '?key=' + getUrlParameter.parameter('providerId'))
  }

  self.init()
}

EditServiceProviderService.prototype = new BaseViewModel()

module.exports = EditServiceProviderService
