var ko = require('knockout')
var _ = require('lodash')
var Address = require('../Address')
var BaseViewModel = require('../BaseViewModel')
var OpeningTime = require('../OpeningTime')
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
    address.openingTimes(_.map(self.preselectedAddress().openingTimes(), function (ot) {
      return new OpeningTime({
        day: ot.day(),
        startTime: ot.startTime(),
        endTime: ot.endTime()
      })
    }))
    self.address(address)
  }

  self.save = function () {
    var endpoint = self.endpointBuilder.serviceProviders(getUrlParameter.parameter('providerId')).services().build()

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

    ajax.post(endpoint, self.headers(cookies.get('session-token')), payload)
    .then(function (result) {
      browser.redirect(adminUrls.serviceProviders + '?key=' + getUrlParameter.parameter('providerId'))
    },
    function (error) {
      self.handleError(error)
    })
  }

  self.init = function () {
    var serviceProviderEndpoint = self.endpointBuilder.serviceProviders(getUrlParameter.parameter('providerId')).build()
    ajax.get(serviceProviderEndpoint, self.headers(cookies.get('session-token')), {})
    .then(function (result) {
      self.addresses(_.map(result.json.addresses, function (a) {
        return new Address(a)
      }))
    },
    function (error) {
      self.handleError(error)
    })
    var categoriesEndpoint = self.endpointBuilder.categories().build()

    ajax.get(categoriesEndpoint, self.headers(cookies.get('session-token')), {})
    .then(function (result) {
      self.categories(result.json)
    },
    function (error) {
      self.handleError(error)
    })
  }

  self.init()
}

AddServiceProviderService.prototype = new BaseViewModel()

module.exports = AddServiceProviderService
