var ajax = require('basic-ajax')
var endpoints = require('../api-endpoints')
var adminUrls = require('../admin-urls')
var cookies = require('../cookies')
var ko = require('knockout')
var _ = require('lodash')

function ServiceProvider (sp) {
  this.key = sp.key
  this.name = sp.name
  this.url = adminUrls.serviceProviders + '?key=' + sp.key
  this.isVerified = ko.observable(sp.isVerified)
  this.isPublished = ko.observable(sp.isPublished)
  this.verifiedLabel = ko.computed(function () { return this.isVerified() ? 'verified' : 'under review' }, this)
  this.toggleVerificationButtonLabel = ko.computed(function () { return this.isVerified() ? 'un-verify' : 'verify' }, this)
  this.publishedLabel = ko.computed(function () { return this.isPublished() ? 'published' : 'disabled' }, this)
  this.togglePublishButtonLabel = ko.computed(function () { return this.isPublished() ? 'disable' : 'publish' }, this)
}

function DashboardModel () {
  var self = this

  self.serviceProviders = ko.observableArray()

  self.init = function () {
    ajax
    .get(endpoints.getServiceProviders,
      {
        'content-type': 'application/json',
        'session-token': cookies.get('session-token')
      },
      {})
    .then(function (result) {
      self.serviceProviders(self.mapServiceProviders(result.json))
    },
    function (error) {
      alert('oops, there was a problem! ' + JSON.parse(error))
    })
  }

  self.mapServiceProviders = function (data) {
    return _
    .chain(data)
    .sortBy('key')
    .map(function (sp) {
      return new ServiceProvider(sp)
    })
    .value()
  }

  self.toggleVerified = function (serviceProvider, event) {
    ajax.put(endpoints.serviceProviderVerifications + '/' + serviceProvider.key + '/update',
      {
        'content-type': 'application/json',
        'session-token': cookies.get('session-token')
      },
      JSON.stringify({
        'IsVerified': !serviceProvider.isVerified()
      })
    )
    .then(function (result) {
      self.updateServiceProviderVerification(serviceProvider, self.invertVerification)
    }, function (error) {
      alert('oops, there was a problem! ' + JSON.parse(error))
    })
  }

  self.invertVerification = function (oldSP, newSP) {
    oldSP.isVerified(!newSP.isVerified())
  }

  self.togglePublished = function (serviceProvider, event) {
    ajax.put(endpoints.serviceProviderPublished + '/' + serviceProvider.key + '/update',
      {
        'content-type': 'application/json',
        'session-token': cookies.get('session-token')
      },
      JSON.stringify({
        'IsPublished': !serviceProvider.isPublished()
      })
    )
    .then(function (result) {
      self.updateServiceProviderVerification(serviceProvider, self.invertPublished)
    }, function (error) {
      alert('oops, there was a problem! ' + JSON.parse(error))
    })
  }

  self.invertPublished = function (oldSP, newSP) {
    oldSP.isPublished(!newSP.isPublished())
  }

  self.updateServiceProviderVerification = function (serviceProvider, invert) {
    var updatedSPs = _.map(self.serviceProviders(), function (sp) {
      if (sp.key !== serviceProvider.key) return sp

      invert(sp, serviceProvider)

      return sp
    })

    self.serviceProviders(updatedSPs)
  }

  self.init()
}

module.exports = DashboardModel
