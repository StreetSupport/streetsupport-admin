var ajax = require('basic-ajax')
var endpoints = require('../api-endpoints')
var adminUrls = require('../admin-urls')
var cookies = require('../cookies')
// var browser = require('../browser')
var getUrlParameter = require('../get-url-parameter')
var ko = require('knockout')
var _ = require('lodash')

function OpeningTime (data) {
  this.day = data.day
  this.startTime = data.startTime
  this.endTime = data.endTime
}

function Address (data) {
  this.street1 = ko.observable(data.street)
  this.street2 = ko.observable(data.street1)
  this.street3 = ko.observable(data.street2)
  this.street4 = ko.observable(data.street3)
  this.city = ko.observable(data.city)
  this.postcode = ko.observable(data.postcode)

  this.openingTimes = ko.observableArray(_.map(data.openingTimes, function (time) {
    return new OpeningTime(time)
  }))
}

function ServiceProvider (data) {
  this.key = ko.observable(data.key)
  this.name = ko.observable(data.name)
  this.addresses = ko.observableArray(_.map(data.addresses, function (address) {
    return new Address(address)
  }))
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
