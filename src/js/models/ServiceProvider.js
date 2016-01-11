var ajax = require('basic-ajax')
var endpoints = require('../api-endpoints')
var adminUrls = require('../admin-urls')
var cookies = require('../cookies')
var browser = require('../browser')
var getUrlParameter = require('../get-url-parameter')
var ko = require('knockout')
var _ = require('lodash')

function ServiceProvider () {
  var self = this
  self.serviceProvider = ko.observable()
  self.isEditingGeneralDetails = ko.observable(false)

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

  self.init = function() {
    ajax
    .get(endpoints.getServiceProviders + '/show/' + getUrlParameter.parameter('key'),
      {
        'content-type': 'application/json',
        'session-token': cookies.get('session-token')
      },
      {})
    .then(function (result) {
      var sp = result.json

      sp.addresses = _.map(sp.addresses, function(address) {
        address.formatted = self.formatAddress(address)
        return address
      })

      self.serviceProvider(sp)
    },
    function (error) {
      browser.redirect(adminUrls.notFound)
    })
  }

  self.editGeneralDetails = function() {
    self.isEditingGeneralDetails(true)
  }

  self.cancelEditGeneralDetails = function() {
    self.isEditingGeneralDetails(false)
  }

  self.init()
}

module.exports = ServiceProvider
