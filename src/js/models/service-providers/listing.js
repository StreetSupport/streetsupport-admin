const ko = require('knockout')

const adminUrls = require('../../admin-urls')
const ajax = require('../../ajax')
const BaseViewModel = require('../BaseViewModel')
const browser = require('../../browser')

import { cities } from '../../../data/generated/supported-cities'

class PaginationLink {
  constructor (listener, pageNumber, isCurrent) {
    this.listener = listener
    this.pageNumber = ko.observable(pageNumber)
    this.isCurrent = ko.observable(isCurrent)
    this.changePage = function () {
      this.listener.changePage(this.pageNumber())
    }
  }
}

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

  self.pageSize = ko.observable(10)
  self.index = ko.observable(0)

  const buildGetUrl = () => {
    return `${self.endpointBuilder.serviceProvidersv3().build()}?pageSize=${self.pageSize()}&index=${self.index()}`
  }

  self.changePage = (pageNumber) => {
    self.index((pageNumber - 1) * self.pageSize())
    self.init()
  }

  const setPaginationLinks = (paginatedData) => {
    const totalPages = Math.ceil(paginatedData.total / self.pageSize())
    const currentPage = Math.ceil(self.index() / self.pageSize())
    self.paginationLinks(Array.from({ length: totalPages })
      .map((_, i) => new PaginationLink(self, i + 1, currentPage === i)))
  }

  self.allServiceProviders = ko.observableArray()
  self.serviceProviders = ko.observableArray()
  self.availableCities = ko.observableArray(cities)
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

  self.init = function () {
    browser.loading()
    console.log(buildGetUrl())
    ajax
      .get(buildGetUrl(), {})
      .then(function (result) {
        setPaginationLinks(result.data)
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
