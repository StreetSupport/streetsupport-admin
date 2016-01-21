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

  self.info = ko.observable()
  self.tags = ko.observable()

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
    var endpoint = new Endpoints().serviceProviders(getUrlParameter.parameter('key')).services().build()
    var headers = {
      'content-type': 'application/json',
      'session-token': cookies.get('session-token')
    }
    var payload = JSON.stringify({
        'Info': self.info(),
        // 'Tags': ['new tags', 'tag 2'],
        // 'OpeningTimes': [{
        //   'StartTime': '09:00',
        //   'EndTime': '10:00',
        //   'Day': 'Monday'
        // },
        // {
        //   'StartTime': '20:00',
        //   'EndTime': '22:00',
        //   'Day': 'Wednesday'
        // }],
        // 'Address': {
        //   'Street1': 'new street 1',
        //   'Street2': 'new street 2' ,
        //   'Street3': 'new street 3' ,
        //   'Street4': 'new street 4' ,
        //   'City': 'new city',
        //   'Postcode': 'new postcode'
        // }
      })

    ajax.post(endpoint, headers, payload)
    .then(function (result) {
      console.log(result)
    }, function (error) {

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
