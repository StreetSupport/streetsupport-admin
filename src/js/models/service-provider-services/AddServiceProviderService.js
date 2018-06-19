'use strict'

const ko = require('knockout')

const Address = require('../Address')
const BaseViewModel = require('../BaseViewModel')
const OpeningTime = require('../OpeningTime')

const adminUrls = require('../../admin-urls')
const ajax = require('../../ajax')
const browser = require('../../browser')
const cookies = require('../../cookies')
const getUrlParameter = require('../../get-url-parameter')

import { categories } from '../../../data/generated/service-categories'

function SubCat (key, name) {
  var self = this
  self.key = key
  self.name = name
  self.isSelected = ko.observable(false)
}

function AddServiceProviderService () {
  var self = this

  self.info = ko.observable()
  self.locationDescription = ko.observable('')
  self.targetAudience = ko.observable('')

  self.categories = ko.observableArray()
  self.category = ko.observable()
  self.telephone = ko.observable()
  self.subCategories = ko.observableArray()

  self.addresses = ko.observableArray()

  self.preselectedAddress = ko.observable()
  self.hasAddresses = ko.computed(function () {
    if (self.addresses === undefined) return false
    if (self.addresses().length === 0) return false
    return true
  }, self)

  self.address = ko.observable(new Address({}))

  self.allSubCatsSelected = ko.observable(false)

  const toggleAllSubCats = (isSelected) => {
    for (let i = 0; i < self.subCategories().length; i++) {
      self.subCategories()[i].isSelected(isSelected)
    }
  }

  self.allSubCatsSelected.subscribe((newValue) => {
    toggleAllSubCats(newValue)
  })

  self.setAvailableSubCategories = function () {
    self.subCategories(self.category().subCategories.map((sc) => new SubCat(sc.key, sc.name)))
    self.allSubCatsSelected(false)
  }

  self.prefillAddress = function () {
    var address = new Address({
      key: self.preselectedAddress().key(),
      street: self.preselectedAddress().street1(),
      street1: self.preselectedAddress().street2(),
      street2: self.preselectedAddress().street3(),
      street3: self.preselectedAddress().street4(),
      city: self.preselectedAddress().city(),
      postcode: self.preselectedAddress().postcode(),
      telephone: self.preselectedAddress().telephone(),
      isOpen247: self.preselectedAddress().isOpen247()
    })
    address.openingTimes(self.preselectedAddress().openingTimes().map((ot) => new OpeningTime({
      day: ot.day(),
      startTime: ot.startTime(),
      endTime: ot.endTime()
    })))
    self.telephone(self.preselectedAddress().telephone())
    self.address(address)
  }

  self.saveService = function () {
    var endpoint = self.endpointBuilder.serviceProviders(getUrlParameter.parameter('providerId')).services().build()

    var tags = []
    if (self.targetAudience().length > 0) tags = self.targetAudience().split(',').map((t) => t.trim())
    if (self.category() === undefined) {
      self.errors(['Please select a category.'])
      browser.scrollTo('.form-feedback')
    } else {
      var payload = {
        'Info': self.info(),
        'LocationDescription': self.locationDescription(),
        'Tags': tags,
        'Category': self.category().key,
        'SubCategories': self.subCategories()
          .filter((sc) => sc.isSelected() === true)
          .map((sc) => sc.key),
        'OpeningTimes': self.address().openingTimes().map((openingTime) => {
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
        'Postcode': self.address().postcode(),
        'Telephone': self.address().telephone(),
        'IsOpen247': self.address().isOpen247()
      }

      ajax.post(endpoint, payload)
      .then(function (result) {
        if (result.statusCode === 201) {
          browser.redirect(adminUrls.serviceProviders + '?key=' + getUrlParameter.parameter('providerId'))
        } else {
          self.handleError(result)
        }
      },
      function (error) {
        self.handleError(error)
      })
    }
  }

  self.init = function () {
    browser.loading()

    var serviceProviderEndpoint = self.endpointBuilder.serviceProviders(getUrlParameter.parameter('providerId')).build()
    ajax.get(serviceProviderEndpoint, {})
    .then(function (result) {
      let addresses = result.data.addresses
        .map((a) => new Address(a))
      self.addresses(addresses)
      browser.loaded()
    },
    function (error) {
      self.handleError(error)
    })

    self.categories(categories.filter((c) => c.key !== 'accom'))
  }

  self.init()
}

AddServiceProviderService.prototype = new BaseViewModel()

module.exports = AddServiceProviderService
