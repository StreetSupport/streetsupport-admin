var ko = require('knockout')
var _ = require('lodash')
var Address = require('../Address')
var OpeningTime = require('../OpeningTime')
var Endpoints = require('../../endpoint-builder')
var getUrlParameter = require('../../get-url-parameter')
var cookies = require('../../cookies')
var ajax = require('basic-ajax')
var browser = require('../../browser')
var adminUrls = require('../../admin-urls')

function SubCat (key, name) {
  var self = this
  self.key = key
  self.name = name
  self.isSelected = ko.observable(false)
}

function AddServiceProviderService () {
  var self = this

  self.info = ko.observable()
  self.targetAudience = ko.observable('')

  self.categories = ko.observableArray()
  self.category = ko.observable()
  self.subCategories = ko.observableArray()

  self.addresses = ko.observableArray()
  self.preselectedAddress = ko.observable()

  self.address = ko.observable(new Address({}))

  self.setAvailableSubCategories = function () {
    self.subCategories(_.map(self.category().subCategories, function (sc) {
      return new SubCat(sc.key, sc.name)
    }))
  }

  self.prefillAddress = function () {
    var address = new Address({
      key: self.preselectedAddress().key(),
      street: self.preselectedAddress().street1(),
      street1: self.preselectedAddress().street2(),
      street2: self.preselectedAddress().street3(),
      street3: self.preselectedAddress().street4(),
      city: self.preselectedAddress().city(),
      postcode: self.preselectedAddress().postcode()
    })
    address.openingTimes(_.map(self.preselectedAddress().openingTimes(), function (ot) { return new OpeningTime({
      day: ot.day(),
      startTime: ot.startTime(),
      endTime: ot.endTime()
    }) }))
    self.address(address)
  }

  self.save = function () {
    var endpoint = new Endpoints().serviceProviders(getUrlParameter.parameter('providerId')).services().build()
    var headers = {
      'content-type': 'application/json',
      'session-token': cookies.get('session-token')
    }

    var tags = []
    if (self.targetAudience().length > 0) tags = _.map(self.targetAudience().split(','), function (t) { return t.trim() })

    var payload = JSON.stringify({
      'Info': self.info(),
      'Tags': tags,
      'Category': self.category().key,
      'SubCategories': _.chain(self.subCategories())
        .filter(sc => sc.isSelected() === true)
        .map(sc => sc.key),
      'OpeningTimes': _.map(self.address().openingTimes(), function (openingTime) {
        return {
          'StartTime': openingTime.startTime(),
          'EndTime': openingTime.endTime(),
          'Day': openingTime.day()
        }
      }),
      'Street1': self.address().street1(),
      'Street2': self.address().street2(),
      'Street3': self.address().street3(),
      'Street4': self.address().street4(),
      'City': self.address().city(),
      'Postcode': self.address().postcode()
    })

    ajax.post(endpoint, headers, payload)
    .then(function (result) {
      browser.redirect(adminUrls.serviceProviders + '?key=' + getUrlParameter.parameter('providerId'))
    }, function (error) {

    })
  }

  self.init = function () {
    var headers = {
      'content-type': 'application/json',
      'session-token': cookies.get('session-token')
    }
    var serviceProviderEndpoint = new Endpoints().serviceProviders(getUrlParameter.parameter('providerId')).build()
    ajax.get(serviceProviderEndpoint, headers, {})
    .then(function (result) {
      self.addresses(_.map(result.json.addresses, function(a) {return new Address(a) }))
    }, function (error) {

    })
    var categoriesEndpoint = new Endpoints().categories().build()

    ajax.get(categoriesEndpoint, headers, {})
    .then(function (result) {
      self.categories(result.json)
    }, function (error) {

    })
  }

  self.init()
}

module.exports = AddServiceProviderService
