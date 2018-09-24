const ko = require('knockout')
const htmlEncode = require('htmlencode')
const marked = require('marked')

const adminUrls = require('../../admin-urls')
const ajax = require('../../ajax')
const browser = require('../../browser')

import { cities } from '../../../data/generated/supported-cities'

const Address = require('../Address')
const BaseViewModel = require('../BaseViewModel')
const GroupedService = require('../GroupedService')
const Need = require('../Need')
const Service = require('../Service')
const spTags = require('../../serviceProviderTags')

function ServiceProvider (data) {
  const self = this

  self.key = ko.observable(data.key)
  self.city = ko.observable(data.associatedCityId)
  self.availableCities = ko.observableArray(cities)
  self.name = ko.observable(data.name)
  self.isVerified = ko.observable(data.isVerified)
  self.shortDescription = ko.observable(htmlEncode.htmlDecode(data.shortDescription))
  self.description = ko.observable(htmlEncode.htmlDecode(data.description))
  self.readOnlyDescription = ko.computed(function () {
    return marked(self.description())
  }, self)
  self.telephone = ko.observable(data.telephone)
  self.email = ko.observable(data.email)
  self.website = ko.observable(data.website)
  self.facebook = ko.observable(data.facebook)
  self.twitter = ko.observable(data.twitter)
  data.addresses.forEach((a) => { a.serviceProviderId = data.key })
  self.addresses = ko.observableArray(data.addresses.map((a) => new Address(a)))
  self.addresses().forEach((a) => a.addListener(self))
  self.donationUrl = ko.observable(data.donationUrl)
  self.donationDescription = ko.observable(htmlEncode.htmlDecode(data.donationDescription))
  self.itemsDonationUrl = ko.observable(data.itemsDonationUrl)
  self.itemsDonationDescription = ko.observable(htmlEncode.htmlDecode(data.itemsDonationDescription))

  self.tags = ko.observableArray(
    spTags.all()
      .map((t) => {
        return {
          id: t.id,
          name: t.name,
          isSelected: ko.observable(spTags.isTagged(data.tags, t))
        }
      })
  )

  data.providedServices.forEach((s) => { s.serviceProviderId = data.key })
  self.services = ko.observableArray(data.providedServices.map((s) => new Service(s)))
  self.services().forEach((s) => s.addListener(self))

  var buildNeeds = function (needs) {
    return needs !== undefined && needs !== null
      ? needs.map((n) => new Need(n))
      : []
  }

  self.groupedServices = ko.observableArray(data.groupedServices
    .map((s) => new GroupedService(s))
    .sort((a, b) => {
      if (a.name > b.name) return 1
      if (a.name < b.name) return -1
      return 0
    }))
  self.groupedServices().forEach((s) => s.addListener(self))

  self.needs = ko.observableArray(buildNeeds(data.needs))
  self.needs().forEach((s) => s.addListener(self))

  self.needCatList = ko.observable(data.needCategories !== undefined ? data.needCategories
          .sort((a, b) => {
            if (a.value > b.value) return 1
            if (a.value < b.value) return -1
            return 0
          }).join(', ') : '')

  self.editNeedCategoriesUrl = adminUrls.serviceProviderNeedCategoriesEdit + '?providerId=' + data.key

  self.addAddressUrl = adminUrls.serviceProviderAddressesAdd + '?providerId=' + data.key
  self.amendAddressesUrl = adminUrls.serviceProviderAddresses + '?key=' + data.key

  self.addServiceUrl = adminUrls.serviceProviderServicesAdd + '?providerId=' + data.key
  self.amendServicesUrl = adminUrls.serviceProviderServices + '?providerId=' + data.key

  self.addNeedUrl = adminUrls.serviceProviderNeedsAdd + '?providerId=' + data.key

  self.verifyOrg = function () {
    ajax
      .put(`${self.endpointBuilder.serviceProviders(self.key()).build()}/is-verified`,
        { IsVerified: true })
      .then((success) => {
        self.isVerified(true)
      }, (e) => {
        browser.redirect(adminUrls.error)
      })
  }

  self.deleteAddress = function (deletedAddress) {
    var notDeleted = function (address) {
      return address.key() !== deletedAddress.key()
    }
    var remainingAddresses = self.addresses().filter((a) => notDeleted(a))
    self.addresses(remainingAddresses)
  }

  self.deleteService = function (deletedService) {
    var notDeleted = function (service) {
      return service.id() !== deletedService.id()
    }
    var remainingServices = self.services().filter((s) => notDeleted(s))
    self.services(remainingServices)
  }

  self.deleteGroupedService = function (deletedService) {
    var notDeleted = function (service) {
      return service.id() !== deletedService.id()
    }
    var remainingServices = self.groupedServices().filter((s) => notDeleted(s))
    self.groupedServices(remainingServices)
  }

  self.deleteNeed = function (deletedNeed) {
    var notDeleted = function (need) {
      return need.id() !== deletedNeed.id()
    }
    var remainingNeeds = self.needs().filter((n) => notDeleted(n))
    self.needs(remainingNeeds)
  }
}

ServiceProvider.prototype = new BaseViewModel()

module.exports = ServiceProvider
