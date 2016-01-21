var ko = require('knockout')
var Address = require('./Address')
var OpeningTime = require('./OpeningTime')
var Endpoints = require('../endpoint-builder')
var getUrlParameter = require('../get-url-parameter')
var cookies = require('../cookies')
var ajax = require('basic-ajax')

function SubCat (key, name) {
  var self = this
  self.key = key
  self.name = name
  self.isSelected = ko.observable(false)
}

function AddServiceProviderService () {
  var self = this

  self.categories = ko.observableArray()
  self.category = ko.observable()
  self.subCategories = ko.observableArray()

  self.addresses = ko.observableArray()
  self.preselectedAddress = ko.observable()

  self.address = ko.observable(new Address({}))

  self.setAvailableSubCategories = function () {
    self.subCategories(self.category().subCategories.map(sc => new SubCat(sc.key, sc.name)))
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
    address.openingTimes(self.preselectedAddress().openingTimes().map(ot => new OpeningTime({
      day: ot.day(),
      startTime: ot.startTime(),
      endTime: ot.endTime()
    })))
    self.address(address)
  }

  self.save = function () {
    console.log('save!')
    console.log(self.category().name)
    console.log(self.address().street1())
    console.log(self.address().street2())
    console.log(self.address().street3())
    console.log(self.address().street4())
    console.log(self.address().city())
    console.log(self.address().postcode())

    self.address().openingTimes().forEach(ot => {
      console.log(ot.day() + ': ' + ot.startTime() + ' - ' + ot.endTime())
    })

    self.subCategories().forEach(sc => {
      if (sc.isSelected()) {
        console.log(sc.name)
      }
    })
  }

  self.init = function () {
    var headers = {
      'content-type': 'application/json',
      'session-token': cookies.get('session-token')
    }
    var serviceProviderEndpoint = new Endpoints().serviceProviders(getUrlParameter.parameter('key')).build()
    ajax.get(serviceProviderEndpoint, headers, {})
    .then(function (result) {
      self.addresses(result.json.addresses.map(a => new Address(a)))
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
