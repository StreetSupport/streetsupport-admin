const ko = require('knockout')

const adminUrls = require('../../admin-urls')
const auth = require('../../auth')
const ajax = require('../../ajax')
const ListingBaseViewModel = require('../ListingBaseViewModel')

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

function DashboardModel () {
  const self = this

  self.filters = [
    { key: 'name', getValue: (vm) => vm.nameToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 },
    { key: 'location', getValue: (vm) => vm.locationToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 },
    { key: 'isVerified', getValue: (vm) => vm.filterOnIsVerified(), isSet: (val) => val !== '' },
    { key: 'isPublished', getValue: (vm) => vm.filterOnIsPublished(), isSet: (val) => val !== '' }
  ]

  self.mapItems = (sp) => { return new ServiceProvider(sp) }
  self.baseUrl = self.endpointBuilder.serviceProvidersv3().build()

  self.availableLocations = ko.observableArray(auth.getLocationsForUser())
  self.shouldShowLocationFilter = ko.computed(function () {
    return self.availableLocations().length > 1
  }, self)
  self.locationToFilterOn = ko.observable()
  self.nameToFilterOn = ko.observable()
  self.filterOnIsVerified = ko.observable('')
  self.filterOnIsPublished = ko.observable('')
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
    const updatedSPs = self.items()
      .map((sp) => {
        if (sp.key === serviceProvider.key) {
          invert(sp, serviceProvider)
        }
        return sp
      })

    self.items(updatedSPs)
  }

  self.init(self)
}

DashboardModel.prototype = new ListingBaseViewModel()

module.exports = DashboardModel
