var ajax = require('../ajax')
var adminUrls = require('../admin-urls')
var cookies = require('../cookies')
var browser = require('../browser')
var ko = require('knockout')
var BaseViewModel = require('./BaseViewModel')

function ServiceProvider (sp) {
  this.key = sp.key
  this.name = sp.name
  this.url = adminUrls.serviceProviders + '?key=' + sp.key
  this.newUserUrl = adminUrls.userAdd + '?key=' + sp.key
  this.isVerified = ko.observable(sp.isVerified)
  this.isPublished = ko.observable(sp.isPublished)
  this.verifiedLabel = ko.computed(function () { return this.isVerified() ? 'verified' : 'under review' }, this)
  this.verifiedLabelClass = ko.computed(function () { return this.isVerified() ? 'status status--true' : 'status status--false' }, this)
  this.toggleVerificationButtonLabel = ko.computed(function () { return this.isVerified() ? 'un-verify' : 'verify' }, this)
  this.publishedLabel = ko.computed(function () { return this.isPublished() ? 'published' : 'disabled' }, this)
  this.publishedLabelClass = ko.computed(function () { return this.isPublished() ? 'status status--true' : 'status status--false' }, this)
  this.togglePublishButtonLabel = ko.computed(function () { return this.isPublished() ? 'disable' : 'publish' }, this)
}

function DashboardModel () {
  var self = this

  self.serviceProviders = ko.observableArray()

  self.init = function () {
    browser.loading()
    ajax
    .get(self.endpointBuilder.serviceProviders().build(),
      self.headers(cookies.get('session-token')),
      {})
    .then(function (result) {
      self.serviceProviders(self.mapServiceProviders(result.data))
      browser.loaded()
    },
    function (error) {
      self.handleError(error)
    })
  }

  self.mapServiceProviders = function (data) {
    return data
    .sort((a, b) => {
      if (a.key > b.key) return 1
      if (a.key < b.key) return -1
      return 0
    }).map((sp) => new ServiceProvider(sp))
  }

  self.toggleVerified = function (serviceProvider, event) {
    ajax.put(self.endpointBuilder.serviceProviders(serviceProvider.key).build() + '/is-verified',
      self.headers(cookies.get('session-token')),
      JSON.stringify({
        'IsVerified': !serviceProvider.isVerified()
      })
    )
    .then(function (result) {
      self.updateServiceProvider(serviceProvider, self.invertVerification)
    },
    function (error) {
      self.handleError(error)
    })
  }

  self.invertVerification = function (oldSP, newSP) {
    oldSP.isVerified(!newSP.isVerified())
  }

  self.togglePublished = function (serviceProvider, event) {
    ajax.put(self.endpointBuilder.serviceProviders(serviceProvider.key).build() + '/is-published',
      self.headers(cookies.get('session-token')),
      JSON.stringify({
        'IsPublished': !serviceProvider.isPublished()
      })
    )
    .then(function (result) {
      self.updateServiceProvider(serviceProvider, self.invertPublished)
    },
    function (error) {
      self.handleError(error)
    })
  }

  self.invertPublished = function (oldSP, newSP) {
    oldSP.isPublished(!newSP.isPublished())
  }

  self.updateServiceProvider = function (serviceProvider, invert) {
    var updatedSPs = self.serviceProviders().map((sp) => {
      if (sp.key !== serviceProvider.key) return sp

      invert(sp, serviceProvider)

      return sp
    })

    self.serviceProviders(updatedSPs)
  }

  self.init()
}

DashboardModel.prototype = new BaseViewModel()

module.exports = DashboardModel
