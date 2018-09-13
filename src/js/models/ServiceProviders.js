const ko = require('knockout')

const adminUrls = require('../admin-urls')
const ajax = require('../ajax')
const BaseViewModel = require('./BaseViewModel')
const browser = require('../browser')

import { cities } from '../../data/generated/supported-cities'

function ServiceProvider (sp) {
  this.key = sp.key
  this.name = sp.name
  this.url = adminUrls.serviceProviders + '?key=' + sp.key
  this.newUserUrl = adminUrls.userAdd + '?key=' + sp.key
  this.associatedLocationIds = sp.associatedLocationIds
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

  self.allServiceProviders = ko.observableArray()
  self.serviceProviders = ko.observableArray()
  self.cityFilter = ko.observable()
  self.isVerifiedFilter = ko.observable()
  self.isPublishedFilter = ko.observable()
  self.availableCities = ko.observableArray(cities)
  self.availableStatuses = ko.observableArray([
    {
      value: true,
      text: 'verified'
    },
    {
      value: false,
      text: 'un-verified'
    }
  ])
  self.availablePublishedStates = ko.observableArray([
    {
      value: true,
      text: 'published'
    },
    {
      value: false,
      text: 'un-published'
    }
  ])

  self.init = function () {
    browser.loading()
    ajax
    .get(self.endpointBuilder.serviceProvidersHAL().build(),
      {})
    .then(function (result) {
      self.allServiceProviders(self.mapServiceProviders(result.data.items))
      self.serviceProviders(self.mapServiceProviders(result.data.items))

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
      {
        'IsVerified': !serviceProvider.isVerified()
      }
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
      {
        'IsPublished': !serviceProvider.isPublished()
      }
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

  self.filter = () => {
    let filtered = self.allServiceProviders()
    if (self.isVerifiedFilter() !== undefined) {
      filtered = filtered
        .filter((sp) => Boolean(sp.isVerified()) === Boolean(self.isVerifiedFilter())) // filter is set as string
    }
    if (self.cityFilter() !== undefined) {
      filtered = filtered
        .filter((sp) => {
          return sp.associatedLocationIds.indexOf(self.cityFilter()) >= 0
        })
    }
    if (self.isPublishedFilter() !== undefined) {
      filtered = filtered
        .filter((sp) => Boolean(sp.isPublished()) === Boolean(self.isPublishedFilter())) // filter is set as string
    }
    self.serviceProviders(filtered)
  }

  self.init()
}

DashboardModel.prototype = new BaseViewModel()

module.exports = DashboardModel
