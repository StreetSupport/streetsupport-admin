var ajax = require('basic-ajax')
var Endpoints = require('../endpoint-builder')
var adminUrls = require('../admin-urls')
var cookies = require('../cookies')
var browser = require('../browser')
var getUrlParameter = require('../get-url-parameter')
var ko = require('knockout')
var _ = require('lodash')

function ServiceProvider (data) {
  this.key = ko.observable(data.key)
  this.name = ko.observable(data.name)
  this.description = ko.observable(data.description)
  this.telephone = ko.observable(data.telephone)
  this.email = ko.observable(data.email)
  this.website = ko.observable(data.website)
  this.facebook = ko.observable(data.facebook)
  this.twitter = ko.observable(data.twitter)
  this.addresses = data.addresses
  this.providedServices = data.providedServices
  this.addAddressUrl = adminUrls.serviceProviderAddressesAdd + '?providerId=' + data.key
  this.amendAddressesUrl = adminUrls.serviceProviderAddresses + '?key=' + data.key
  this.amendServicesUrl = adminUrls.serviceProviderServices + '?providerId=' + data.key
}

function ServiceProviderDetails () {
  var self = this
  self.initialServiceProvider = ko.observable()
  self.serviceProvider = ko.observable()
  self.isEditingGeneralDetails = ko.observable(false)
  self.isEditingContactDetails = ko.observable(false)
  self.message = ko.observable('')
  self.endpoints = new Endpoints()

  self.init = function () {
    var providerId = getUrlParameter.parameter('key')
    ajax.get(self.endpoints.serviceProviders(providerId).build(),
      {
        'content-type': 'application/json',
        'session-token': cookies.get('session-token')
      },
      {})
      .then(function (result) {
        self.serviceProvider(new ServiceProvider(result.json))
        self.initialServiceProvider(new ServiceProvider(result.json))
      },
      function (error) {
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
      ajax.put(self.endpoints.serviceProviders(getUrlParameter.parameter('key')).generalInformation().build(),
        {
          'content-type': 'application/json',
          'session-token': cookies.get('session-token')
        },
        JSON.stringify({
          'Description': self.serviceProvider().description()
        })
        ).then(function (result) {
          self.isEditingGeneralDetails(false)
        }, function (error) {
          var response = JSON.parse(error.response)
          self.message(response.messages.join('<br />'))
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
      ajax.put(self.endpoints.serviceProviders(getUrlParameter.parameter('key')).contactDetails().build(),
        {
          'content-type': 'application/json',
          'session-token': cookies.get('session-token')
        },
        JSON.stringify({
          'Telephone': self.serviceProvider().telephone(),
          'Email': self.serviceProvider().email(),
          'Website': self.serviceProvider().website(),
          'Facebook': self.serviceProvider().facebook(),
          'Twitter': self.serviceProvider().twitter()
        })
        ).then(function (result) {
          self.isEditingContactDetails(false)
        }, function (error) {
          var response = JSON.parse(error.response)
          self.message(response.messages.join('<br />'))
        })
    }
  }

  self.restoreViewModel = function () {
    self.serviceProvider().description(self.initialServiceProvider().description())

    self.serviceProvider().telephone(self.initialServiceProvider().telephone())
    self.serviceProvider().email(self.initialServiceProvider().email())
    self.serviceProvider().website(self.initialServiceProvider().website())
    self.serviceProvider().facebook(self.initialServiceProvider().facebook())
    self.serviceProvider().twitter(self.initialServiceProvider().twitter())
  }

  self.init()
}

module.exports = ServiceProviderDetails
