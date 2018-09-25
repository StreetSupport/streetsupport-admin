const ko = require('knockout')

const adminUrls = require('../../admin-urls')
const auth = require('../../auth')
const ajax = require('../../ajax')
const BaseViewModel = require('../BaseViewModel')
const browser = require('../../browser')

import { cities as locations } from '../../../data/generated/supported-cities'
import ListingPagination from '../ListingPagination'

class ServiceProvider {
  constructor (sp) {
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
}

const mapServiceProviders = function (data) {
  return data
    .sort((a, b) => {
      if (a.key > b.key) return 1
      if (a.key < b.key) return -1
      return 0
    }).map((sp) => new ServiceProvider(sp))
}

function DashboardModel () {
  const self = this

  const locationsForUser = auth.isCityAdmin()
  ? locations.filter((l) => auth.locationsAdminFor().includes(l.id))
  : locations

  const buildGetUrl = () => {
    const filters = [
      { key: 'pageSize', getValue: () => self.pagination.pageSize, isSet: (val) => true },
      { key: 'index', getValue: () => self.pagination.index, isSet: (val) => true },
      { key: 'name', getValue: self.nameToFilterOn, isSet: (val) => val !== undefined && val.length > 0 },
      { key: 'location', getValue: self.locationToFilterOn, isSet: (val) => val !== undefined && val.length > 0 },
      { key: 'isVerified', getValue: self.filterOnIsVerified, isSet: (val) => val !== '' },
      { key: 'isPublished', getValue: self.filterOnIsPublished, isSet: (val) => val !== '' }
    ]

    const filterQueryString = filters
      .filter((f) => f.isSet(f.getValue()))
      .map((f) => `${f.key}=${f.getValue()}`)
      .join('&')

    return `${self.endpointBuilder.serviceProvidersv3().build()}?${filterQueryString}`
  }

  self.pagination = new ListingPagination(self)

  self.allServiceProviders = ko.observableArray()
  self.serviceProviders = ko.observableArray()
  self.shouldShowLocationFilter = ko.computed(function () {
    return locationsForUser.length > 1
  }, self)
  self.availableLocations = ko.observableArray(locationsForUser)
  self.locationToFilterOn = ko.observable()
  self.nameToFilterOn = ko.observable()
  self.filterOnIsVerified = ko.observable('')
  self.filterOnIsPublished = ko.observable('')
  self.paginationLinks = ko.observableArray([])
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

  self.submitSearch = function () {
    self.pagination.changePage(1)
  }

  self.loadDocuments = function () {
    browser.loading()
    ajax
      .get(buildGetUrl(), {})
      .then(function (result) {
        self.pagination.updateData(result.data)
        self.allServiceProviders(mapServiceProviders(result.data.items))
        self.serviceProviders(mapServiceProviders(result.data.items))

        browser.loaded()
      },
        function (error) {
          self.handleError(error)
        })
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
    const updatedSPs = self.serviceProviders()
      .map((sp) => {
        if (sp.key === serviceProvider.key) {
          invert(sp, serviceProvider)
        }
        return sp
      })

    self.serviceProviders(updatedSPs)
  }

  self.loadDocuments()
}

DashboardModel.prototype = new BaseViewModel()

module.exports = DashboardModel
