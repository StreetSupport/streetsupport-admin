var ko = require('knockout')

var ajax = require('../../ajax')
var adminUrls = require('../../admin-urls')
var browser = require('../../browser')
var getUrlParameter = require('../../get-url-parameter')
var ServiceProvider = require('./ServiceProvider')
var BaseViewModel = require('../BaseViewModel')

function ServiceProviderDetails () {
  var self = this
  self.initialServiceProvider = ko.observable()
  self.serviceProvider = ko.observable()
  self.isEditingGeneralDetails = ko.observable(false)
  self.isEditingContactDetails = ko.observable(false)
  self.isEditingDonationDetails = ko.observable(false)
  self.message = ko.observable('')

  self.init = function () {
    browser.loading()
    var providerId = getUrlParameter.parameter('key')

    ajax.get(self.endpointBuilder.serviceProviders(providerId).build(),
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
          .map((m) => m.id)
      }

      const payload = {
        'Name': sp.name(),
        'Description': sp.description(),
        'ShortDescription': sp.shortDescription(),
        'Tags': tagsToCsv(),
        'AssociatedLocationIds': typeof sp.city() === 'string' ? [ sp.city() ] : sp.city()
      }

      ajax.put(self.endpointBuilder.serviceProviders(getUrlParameter.parameter('key')).generalInformation().build(),
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

  self.editDonationDetails = function () {
    self.isEditingDonationDetails(true)
  }

  self.cancelEditDonationDetails = function () {
    self.isEditingDonationDetails(false)
    self.restoreViewModel()
  }

  self.saveDonationDetails = function () {
    if (self.isEditingDonationDetails()) {
      const sp = self.serviceProvider()

      const payload = {
        'DonationUrl': sp.donationUrl(),
        'DonationDescription': sp.donationDescription(),
        'ItemsDonationUrl': sp.itemsDonationUrl(),
        'ItemsDonationDescription': sp.itemsDonationDescription()
      }
      const endpoint = self.endpointBuilder.serviceProviders(getUrlParameter.parameter('key')).donationInformation().build()
      ajax.put(endpoint,
        payload
        ).then(function (result) {
          if (result.statusCode === 200) {
            self.isEditingDonationDetails(false)
            self.clearErrors()
          } else {
            self.handleError(result)
          }
        })
    }
  }

  self.restoreViewModel = function () {
    self.serviceProvider().name(self.initialServiceProvider().name())
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
