'use strict'

const ajax = require('../../ajax')
const auth = require('../../auth')
const browser = require('../../browser')
const BaseViewModel = require('../BaseViewModel')
const ko = require('knockout')
const Volunteer = require('./Volunteer')

import { cities as locations } from '../../../data/generated/supported-cities'
import { categories as volCategories } from '../../../data/generated/volunteer-categories.js'
import ListingPagination from '../ListingPagination'

const ListVolunteersModel = function () {
  const self = this

  const locationsForUser = auth.isCityAdmin()
    ? locations.filter((l) => auth.locationsAdminFor().includes(l.id))
    : locations

  self.allVolunteers = ko.observableArray()
  self.volunteers = ko.observableArray()
  self.searchTerm = ko.observable()
  self.isFilteredByHighlighted = ko.observable(false)
  self.cityFilter = ko.observable()
  self.availableLocations = ko.observableArray(locationsForUser)
  self.volCategories = ko.observableArray(volCategories)

  self.paginationLinks = ko.observableArray([])
  self.pagination = new ListingPagination(self)

  self.locationToFilterOn = ko.observable()
  self.volCategoryToFilterOn = ko.observable()
  self.textSearchToFilterOn = ko.observable()
  self.filterOnIsArchived = ko.observable('')

  self.shouldShowLocationFilter = ko.computed(function () {
    return locationsForUser.length > 1
  }, self)

  self.submitSearch = function () {
    self.pagination.changePage(1)
  }

  const buildGetUrl = () => {
    const filters = [
      { key: 'pageSize', getValue: () => self.pagination.pageSize, isSet: (val) => true },
      { key: 'index', getValue: () => self.pagination.index, isSet: (val) => true },
      { key: 'location', getValue: self.locationToFilterOn, isSet: (val) => val !== undefined && val.length > 0 },
      { key: 'skillsCategory', getValue: self.volCategoryToFilterOn, isSet: (val) => val !== undefined && val.length > 0 },
      { key: 'search', getValue: self.textSearchToFilterOn, isSet: (val) => val !== undefined && val.length > 0 },
      { key: 'isArchived', getValue: self.filterOnIsArchived, isSet: (val) => val !== '' }
    ]

    const filterQueryString = filters
      .filter((f) => f.isSet(f.getValue()))
      .map((f) => `${f.key}=${f.getValue()}`)
      .join('&')

    return `${self.endpointBuilder.volunteers().build()}?${filterQueryString}`
  }

  self.loadDocuments = () => {
    self.isFilteredByHighlighted(false)
    browser.loading()

    ajax
      .get(buildGetUrl())
      .then(function (result) {
        const volunteers = result.data.items
          .map((v) => new Volunteer(v, self))

        self.pagination.updateData(result.data)

        self.allVolunteers(volunteers)
        self.volunteers(volunteers)

        browser.loaded()
      }, function (error) {
        self.handleServerError(error)
      })
  }

  self.filterByHighlighted = () => {
    if (self.isFilteredByHighlighted()) {
      const filtered = self.volunteers()
        .filter((v) => v.isHighlighted() === true)
      self.volunteers(filtered)
    } else {
      self.volunteers(self.allVolunteers())
    }
  }

  self.isFilteredByHighlighted.subscribe(() => self.filterByHighlighted(), self)

  self.archived = (id) => {
    self.allVolunteers(self.allVolunteers()
      .filter((v) => v.id !== id))
    self.volunteers(self.volunteers()
      .filter((v) => v.id !== id))
  }

  self.loadDocuments()
}

ListVolunteersModel.prototype = new BaseViewModel()

module.exports = ListVolunteersModel
