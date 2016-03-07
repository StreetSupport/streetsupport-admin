var ko = require('knockout')
var _ = require('lodash')
var ajax = require('basic-ajax')
var Endpoints = require('../endpoint-builder')
var getUrlParameter = require('../get-url-parameter')
var cookies = require('../cookies')
var OpeningTime = require('./OpeningTime')
var BaseViewModel = require('./BaseViewModel')
var adminUrls = require('../admin-urls')

function Need (data) {
  var self = this
  self.endpoints = new Endpoints()

  self.serviceProviderId = data.serviceProviderId
  self.availableTypes = ko.observableArray(['Money', 'People', 'Things'])

  self.id = ko.observable(data.id)

  self.description = ko.observable(data.description)
  self.type = ko.observable(data.type)
  self.isPeopleOrThings = ko.computed(function () {
    var type = self.type()
    return type !== undefined && (type.toLowerCase() === 'people' || type.toLowerCase() === 'things')
  }, self)
  self.isMoney = ko.computed(function () {
    var type = self.type()
    return type !== undefined && (type.toLowerCase() === 'money')
  }, self)
  self.reason = ko.observable(data.reason)
  self.moreInfoUrl = ko.observable(data.moreInfoUrl)
  self.postcode = ko.observable(data.postcode)
  self.instructions = ko.observable(data.instructions)
  self.email = ko.observable(data.email)
  self.donationAmountInPounds = ko.observable(data.donationAmountInPounds)
  self.donationUrl = ko.observable(data.donationUrl)

  self.tempKey = ko.observable(data.tempKey)
  self.isEditing = ko.observable(false)
  self.listeners = ko.observableArray()

  self.editNeedUrl = adminUrls.serviceProviderNeedsEdit + '?providerId=' + self.serviceProviderId + '&needId=' + self.id()

  self.deleteNeed = function () {
    var endpoint = self.endpointBuilder.serviceProviders(getUrlParameter.parameter('key')).needs(self.id()).build()
    ajax.delete(endpoint, self.headers(cookies.get('session-token')), JSON.stringify({}))
    .then(function (result) {
      _.forEach(self.listeners(), function (listener) {
        listener.deleteNeed(self)
      })
    }, function (error) {
      self.handleError(error)
    })
  }

  self.save = function () {
    var model = JSON.stringify({
      'Description': self.description(),
      'Type': self.type(),
      'Reason': self.reason(),
      'MoreInfoUrl': self.moreInfoUrl(),
      'Postcode': self.postcode(),
      'Instructions': self.instructions(),
      'Email': self.email(),
      'DonationAmountInPounds': self.donationAmountInPounds(),
      'DonationUrl': self.donationUrl()
    })

    if (self.id() === undefined) {
      ajax.post(self.endpointBuilder.serviceProviders(getUrlParameter.parameter('providerId')).needs().build(),
        self.headers(cookies.get('session-token')),
        model
      ).then(function (result) {
        _.forEach(self.listeners(), function (listener) {
          listener.saveNeed(self)
        })
      }, function (error) {
        self.handleError(error)
      })
    } else {
      ajax.put(self.endpointBuilder.serviceProviders(getUrlParameter.parameter('providerId')).needs(self.id()).build(),
        self.headers(cookies.get('session-token')),
        model
      ).then(function (result) {
        // _.forEach(self.listeners(), function (listener) {
        //   listener.saveAddress(self)
        // })
      }, function (error) {
        self.handleError(error)
      })
    }
  }

  self.addListener = function (listener) {
    self.listeners().push(listener)
  }
}

Need.prototype = new BaseViewModel()

module.exports = Need
