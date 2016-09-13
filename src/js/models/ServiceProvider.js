var ajax = require('../ajax')
var htmlEncode = require('htmlencode')
var adminUrls = require('../admin-urls')
var cookies = require('../cookies')
var browser = require('../browser')
var getUrlParameter = require('../get-url-parameter')
var Address = require('./Address')
var Service = require('./Service')
var GroupedService = require('./GroupedService')
var Need = require('./Need')
var ko = require('knockout')
var BaseViewModel = require('./BaseViewModel')
var spTags = require('../serviceProviderTags')

function ServiceProvider (data) {
  var self = this

  self.key = ko.observable(data.key)
  self.city = ko.observable(data.associatedCityId)
  self.name = ko.observable(data.name)
  self.shortDescription = ko.observable(htmlEncode.htmlDecode(data.shortDescription))
  self.description = ko.observable(htmlEncode.htmlDecode(data.description))
  self.telephone = ko.observable(data.telephone)
  self.email = ko.observable(data.email)
  self.website = ko.observable(data.website)
  self.facebook = ko.observable(data.facebook)
  self.twitter = ko.observable(data.twitter)
  data.addresses.forEach((a) => { a.serviceProviderId = data.key })
  self.addresses = ko.observableArray(data.addresses.map((a) => new Address(a)))
  self.addresses().forEach((a) => a.addListener(self))
  self.donationUrl = ko.observable(data.donationUrl)
  self.donationDescription = ko.observable(data.donationDescription)

  self.tags = ko.observableArray(
    spTags.all()
      .map((t) => {
        return {
          name: t,
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

  self.groupedServices = ko.observableArray(data.groupedServices.map((s) => new GroupedService(s)))
  self.groupedServices().forEach((s) => s.addListener(self))

  self.needs = ko.observableArray(buildNeeds(data.needs))
  self.needs().forEach((s) => s.addListener(self))

  self.addAddressUrl = adminUrls.serviceProviderAddressesAdd + '?providerId=' + data.key
  self.amendAddressesUrl = adminUrls.serviceProviderAddresses + '?key=' + data.key

  self.addServiceUrl = adminUrls.serviceProviderServicesAdd + '?providerId=' + data.key
  self.amendServicesUrl = adminUrls.serviceProviderServices + '?providerId=' + data.key

  self.addNeedUrl = adminUrls.serviceProviderNeedsAdd + '?providerId=' + data.key

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

function ServiceProviderDetails () {
  var self = this
  self.initialServiceProvider = ko.observable()
  self.serviceProvider = ko.observable()
  self.isEditingGeneralDetails = ko.observable(false)
  self.isEditingContactDetails = ko.observable(false)
  self.message = ko.observable('')

  self.init = function () {
    browser.loading()
    var providerId = getUrlParameter.parameter('key')

    ajax.get(self.endpointBuilder.serviceProviders(providerId).build(),
      self.headers(cookies.get('session-token')),
      {})
      .then(function (result) {
        self.serviceProvider(new ServiceProvider(result.data))
        self.initialServiceProvider(new ServiceProvider(result.data))
        browser.loaded()
      },
      function () {
        browser.redirect(adminUrls.notFound)
      })
  }

  self.editGeneralDetails = function () {
    self.isEditingGeneralDetails(true)
  }

  self.cancelEditGeneralDetails = function () {
    self.isEditingGeneralDetails(false)
    self.restoreViewModel()
  }

  self.saveGeneralDetails = function () {
    if (self.isEditingGeneralDetails()) {
      const sp = self.serviceProvider()

      const tagsToCsv = () => {
        return sp.tags()
          .filter((t) => t.isSelected() === true)
          .map((m) => spTags.urlEncoded(m.name))
      }
      const payload = {
        'Description': sp.description(),
        'ShortDescription': sp.shortDescription(),
        'Tags': tagsToCsv(),
        'DonationUrl': sp.donationUrl(),
        'DonationDescription': sp.donationDescription()
      }
      ajax.put(self.endpointBuilder.serviceProviders(getUrlParameter.parameter('key')).generalInformation().build(),
        self.headers(cookies.get('session-token')),
        payload
        ).then(function (result) {
          if (result.statusCode === 200) {
            self.isEditingGeneralDetails(false)
            self.clearErrors()
          } else {
            self.handleError(result)
          }
        })
    }
  }

  self.editContactDetails = function () {
    self.isEditingContactDetails(true)
  }

  self.cancelEditContactDetails = function () {
    self.isEditingContactDetails(false)
    self.restoreViewModel()
  }

  self.saveContactDetails = function () {
    if (self.isEditingContactDetails()) {
      ajax.put(self.endpointBuilder.serviceProviders(getUrlParameter.parameter('key')).contactDetails().build(),
        self.headers(cookies.get('session-token')),
        {
          'Telephone': self.serviceProvider().telephone(),
          'Email': self.serviceProvider().email(),
          'Website': self.serviceProvider().website(),
          'Facebook': self.serviceProvider().facebook(),
          'Twitter': self.serviceProvider().twitter()
        }
        ).then(function (result) {
          if (result.statusCode === 200) {
            self.isEditingContactDetails(false)
            self.clearErrors()
          } else {
            self.handleError(result)
          }
        }, function (error) {
          self.handleError(error)
        })
    }
  }

  self.restoreViewModel = function () {
    self.serviceProvider().shortDescription(self.initialServiceProvider().shortDescription())
    self.serviceProvider().description(self.initialServiceProvider().description())
    self.serviceProvider().tags(self.initialServiceProvider().tags())
    self.serviceProvider().telephone(self.initialServiceProvider().telephone())
    self.serviceProvider().email(self.initialServiceProvider().email())
    self.serviceProvider().website(self.initialServiceProvider().website())
    self.serviceProvider().facebook(self.initialServiceProvider().facebook())
    self.serviceProvider().twitter(self.initialServiceProvider().twitter())
    self.serviceProvider().donationUrl(self.initialServiceProvider().donationUrl())
    self.serviceProvider().donationDescription(self.initialServiceProvider().donationDescription())
  }

  self.init()
}

ServiceProviderDetails.prototype = new BaseViewModel()

module.exports = ServiceProviderDetails
