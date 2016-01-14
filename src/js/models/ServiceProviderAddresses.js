var ajax = require('basic-ajax')
var endpoints = require('../api-endpoints')
var adminUrls = require('../admin-urls')
var cookies = require('../cookies')
var Address = require('./Address')
// var browser = require('../browser')
var getUrlParameter = require('../get-url-parameter')
var ko = require('knockout')
var _ = require('lodash')
var guid = require('node-uuid')

function ServiceProvider (data) {
  var self = this

  self.key = ko.observable(data.key)
  self.name = ko.observable(data.name)
  self.addresses = ko.observableArray(_.map(data.addresses, function (address) {
    return new Address(address)
  }))

  self.addAddress = function () {

    var tempKey = guid.v4()

    var addresses = self.addresses()
    var newAddress = new Address({
      'openingTimes': [],
      'tempKey': tempKey
    })
    newAddress.addListener(self)
    newAddress.edit()
    addresses.push(newAddress)
    self.addresses(addresses)
  }

  self.cancelAddress = function (cancelledAddress) {
    var remainingAddresses = _.filter(self.addresses(), function (address) {
      var isNew = address.tempKey() === undefined

      if(isNew) return true

      var isNotTheAddressWeAreLookingFor = address.tempKey() !== cancelledAddress.tempKey()

      return isNotTheAddressWeAreLookingFor
    })
    self.addresses(remainingAddresses)
  }
}

function ServiceProviderAddresses () {
  var self = this
  self.serviceProvider = ko.observable()

  self.init = function () {
    ajax.get(endpoints.serviceProviderAddresses + '/show/' + getUrlParameter.parameter('key'),
      {
        'content-type': 'application/json',
        'session-token': cookies.get('session-token')
      },
      {})
      .then(function (result) {
        self.serviceProvider(new ServiceProvider(result.json))
      },
      function (error) {
      })
  }

  self.init()
}

module.exports = ServiceProviderAddresses
