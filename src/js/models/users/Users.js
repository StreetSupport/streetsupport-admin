'use strict'
import { cities as locations } from '../../../data/generated/supported-cities'

const ajax = require('../../ajax')
const auth = require('../../auth')
const browser = require('../../browser')
const BaseViewModel = require('../BaseViewModel')
const ListingBaseViewModel = require('../ListingBaseViewModel')
const ko = require('knockout')

function User (data, listener) {
  const self = this
  self.listener = listener
  self.id = ko.observable(data.id)
  self.username = ko.observable(data.userName)
  self.email = ko.observable(data.email)
  self.claims = ko.observable(data.claims.join(', '))
  self.verificationExpiryDate = ko.observable(data.verificationExpiryDate)
  self.associatedAreaId = ko.observable(data.associatedAreaId)

  self.removeAccess = () => {
    browser.loading()

    ajax
      .delete(self.endpointBuilder.users(self.id()).build())
      .then((success) => {
        listener.userDeleted(self.id())
        browser.loaded()
      }, function (error) {
        self.handleServerError(error)
      })
  }
}

User.prototype = new BaseViewModel()

function ListUsers () {
  const self = this

  self.roles = [
    { id: 'SuperAdmin' },
    { id: 'CityAdmin' },
    { id: 'OrgAdmin' },
    { id: 'CharterAdmin' },
    { id: 'TempAccomAdmin' },
    { id: 'IndividualAccomAdmin' }
  ]
  self.availableLocations = auth.isCityAdmin()
    ? locations.filter((l) => auth.locationsAdminFor().includes(l.id))
    : locations
  self.shouldShowLocationFilter = self.availableLocations.length > 1

  self.filterOnRole = ko.observable()
  self.filterOnRole
    .subscribe((newValue) => {
      if (newValue !== 'OrgAdmin') {
        self.locationToFilterOn('')
      }
    })

  self.locationToFilterOn = ko.observable()

  self.filters = [
    { key: 'role', setValue: (vm, value) => vm.filterOnRole(value), getValue: (vm) => vm.filterOnRole(), isSet: (val) => val !== undefined && val.length > 0 },
    { key: 'location', setValue: (vm, value) => vm.locationToFilterOn(value), getValue: (vm) => vm.locationToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 }
  ]
  self.mapItems = (p) => new User(p, self)
  self.mapCsvItems = self.mapItems
  self.baseUrl = self.endpointBuilder.users().build()

  self.userDeleted = function (userId) {
    self.items(self.items().filter((u) => u.id() !== userId))
  }

  self.init(self)
}

ListUsers.prototype = new ListingBaseViewModel()

module.exports = ListUsers
