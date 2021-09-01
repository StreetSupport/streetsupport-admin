const ko = require('knockout')

const adminUrls = require('../../admin-urls')
const auth = require('../../auth')
const ajax = require('../../ajax')
const ListingBaseViewModel = require('../ListingBaseViewModel')
const htmlEncode = require('htmlencode')
const moment = require('moment')
const dateFormat = 'YYYY-MM-DD'
const browser = require('../../browser')
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
    this.notes = sp.notes ? ko.observableArray(sp.notes.map((e) => { return new Note(e) }).reverse()) : ko.observableArray()
  }
}

class Note {
  constructor (data) {
    this.creationDate = ko.observable(data ? data.creationDate : moment())
    this.date = ko.observable(data ? data.date : moment().format(dateFormat))
    this.staffName = ko.observable(data ? htmlEncode.htmlDecode(data.staffName) : null)
    this.reason = ko.observable(data ? htmlEncode.htmlDecode(data.reason) : null)
  }
}

function DashboardModel () {
  const self = this

  self.moment = moment
  self.dateFormat = dateFormat
  self.isOpenNotesInputModal = ko.observable(false)
  self.isOpenNotesModal = ko.observable(false)
  self.isOpenClearNotesConfirmationDialog = ko.observable(false)
  self.currentServiceProvider = ko.observable()
  self.note = ko.observable(new Note())
  self.errorMessage = ko.observable()

  self.filters = [
    { key: 'name', setValue: (vm, value) => vm.nameToFilterOn(value), getValue: (vm) => vm.nameToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 },
    { key: 'location', setValue: (vm, value) => vm.locationToFilterOn(value), getValue: (vm) => vm.locationToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 },
    { key: 'isVerified', setValue: (vm, value) => vm.filterOnIsVerified(Boolean(value)), getValue: (vm) => vm.filterOnIsVerified(), isSet: (val) => val !== '' },
    { key: 'isPublished', setValue: (vm, value) => vm.filterOnIsPublished(Boolean(value)), getValue: (vm) => vm.filterOnIsPublished(), isSet: (val) => val !== '' }
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

  self.toggleNotes = function (serviceProvider, event) {
    if (!self.isOpenNotesModal()) {
      self.currentServiceProvider(serviceProvider)
    } else {
      self.currentServiceProvider(null)
    }
    self.isOpenNotesModal(!self.isOpenNotesModal())
  }

  self.toggleNotesInput = function (serviceProvider, event) {
    // if we want to disable or publish service provider
    if (!self.isOpenNotesInputModal()) {
      self.currentServiceProvider(serviceProvider)

      // if we want to disable service provider
      if (serviceProvider.isPublished()) {
        self.isOpenNotesInputModal(!self.isOpenNotesInputModal())
      } else { // if we want to publish service provider
        self.togglePublished()
      }
    } else { // if we want to close modal (we don't want to disable service provider)
      self.isOpenNotesInputModal(!self.isOpenNotesInputModal())
      self.note(new Note())
      self.currentServiceProvider(null)
    }
  }

  self.togglePublished = function () {
    if (self.currentServiceProvider().isPublished()) {
      if (!self.note().date() || !self.note().staffName() || !self.note().staffName().trim() || !self.note().reason() || !self.note().reason().trim()) {
        self.errorMessage('Please fill all fields')
      } else {
        self.errorMessage(null)
        self.isOpenNotesInputModal(!self.isOpenNotesInputModal())
      }
    }

    if (!self.isOpenNotesInputModal()) {
      ajax.put(self.endpointBuilder.serviceProviders(self.currentServiceProvider().key).build() + '/is-published',
        {
          'IsPublished': !self.currentServiceProvider().isPublished(),
          'Note': {
            CreationDate: self.note().creationDate().toISOString(),
            // We must use new Date() for passing date without timezone. In the database this date should be saved in utc format (00 hours 00 minutes).
            Date: new Date(self.note().date()),
            StaffName: self.note().staffName(),
            Reason: self.note().reason()
          }
        })
    .then(function (result) {
      self.updateServiceProvider(self.currentServiceProvider(), self.invertPublished)
      if (!self.currentServiceProvider().isPublished() && (self.currentServiceProvider().notes().length === 1 || moment(self.note().date()).isSame(moment().format(dateFormat)))) {
        browser.refresh()
      }
      self.currentServiceProvider(null)
      self.note(new Note())
    },
      function (error) {
        self.handleError(error)
      })
    }
  }

  self.handleClearNotesConfirmation = function () {
    self.isOpenClearNotesConfirmationDialog(!self.isOpenClearNotesConfirmationDialog())
  }

  self.clearNotes = function () {
    ajax.delete(self.endpointBuilder.serviceProviders(self.currentServiceProvider().key).build() + '/clear-notes')
    .then(function () {
      self.isOpenClearNotesConfirmationDialog(false)
      self.isOpenNotesModal(false)
      self.currentServiceProvider().notes([])
    },
      function (error) {
        self.isOpenClearNotesConfirmationDialog(false)
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
          if (serviceProvider.isPublished()) {
            sp.notes().unshift(self.note())
          }
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
