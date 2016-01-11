var ajax = require('basic-ajax')
var endpoints = require('../api-endpoints')
var adminUrls = require('../admin-urls')
var cookies = require('../cookies')
var browser = require('../browser')
var getUrlParameter = require('../get-url-parameter')
var ko = require('knockout')
var _ = require('lodash')

function ServiceProvider (data) {
  this.key = ko.observable(data.key)
  this.name = ko.observable(data.name)
  this.description = ko.observable(data.description)
  this.telephone = ko.observable(data.telephone)
  this.email = ko.observable(data.email)
  this.website = ko.observable(data.website)
  this.facebook = ko.observable(data.facebook)
  this.twitter = ko.observable(data.twitter)
  this.addresses = data.addresses
  this.providedServices = data.providedServices
}

function ServiceProviderDetails () {
  var self = this
  self.initialServiceProvider = ko.observable()
  self.serviceProvider = ko.observable()
  self.isEditingGeneralDetails = ko.observable(false)
  self.message = ko.observable('')

  self.formatAddress = function (address) {
    return _.chain(['street', 'street1', 'street2', 'street3', 'city', 'postcode'])
        .filter(function (key) {
          return address[key] !== null
        })
        .map(function (key) {
          return address[key]
        })
        .value()
        .join(', ')
  }

  self.init = function () {
    ajax.get(endpoints.getServiceProviders + '/show/' + getUrlParameter.parameter('key'),
      {
        'content-type': 'application/json',
        'session-token': cookies.get('session-token')
      },
      {})
      .then(function (result) {
        var sp = result.json

        sp.addresses = _.map(sp.addresses, function (address) {
          address.formatted = self.formatAddress(address)
          return address
        })

        self.serviceProvider(new ServiceProvider(sp))
        self.initialServiceProvider(new ServiceProvider(sp))
      },
      function (error) {
        browser.redirect(adminUrls.notFound)
      })
  }

  self.editGeneralDetails = function () {
    self.isEditingGeneralDetails(true)
  }

  self.cancelEditGeneralDetails = function () {
    self.isEditingGeneralDetails(false)
    self.restoreViewModel()
  }

  self.saveGeneralDetails = function () {
    if (self.isEditingGeneralDetails()) {
      ajax.put(endpoints.serviceProviderDetails + '/' + getUrlParameter.parameter('key') + '/update',
        {
          'content-type': 'application/json',
          'session-token': cookies.get('session-token')
        },
        JSON.stringify({
          'Description': self.serviceProvider().description()
        })
        ).then(function (result) {
          self.isEditingGeneralDetails(false)
        }, function (error) {
          var response = JSON.parse(error.response)
          self.message(response.messages.join('<br />'))
        })
    }
  }

  self.restoreViewModel = function () {
    self.serviceProvider().description(self.initialServiceProvider().description())
  }

  self.init()
}

module.exports = ServiceProviderDetails
