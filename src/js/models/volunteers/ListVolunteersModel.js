'use strict'

const ajax = require('../../ajax')
const browser = require('../../browser')
const BaseViewModel = require('../BaseViewModel')
const ko = require('knockout')
const Volunteer = require('./Volunteer')

import ListingPagination from '../ListingPagination'

const ListVolunteersModel = function () {
  const self = this

  self.allVolunteers = ko.observableArray()
  self.volunteers = ko.observableArray()
  self.searchTerm = ko.observable()
  self.isFilteredByHighlighted = ko.observable(false)
  self.cityFilter = ko.observable()
  self.availableCities = ko.observableArray()

  self.paginationLinks = ko.observableArray([])
  self.pagination = new ListingPagination(self)

  const buildGetUrl = () => {
    const filters = [
      { key: 'pageSize', getValue: () => self.pagination.pageSize, isSet: (val) => true },
      { key: 'index', getValue: () => self.pagination.index, isSet: (val) => true }
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

        self.availableCities(volunteers
          .map((v) => v.person.city)
          .filter((e, i, a) => { return a.indexOf(e) === i })
          .filter((c) => c !== null)
          .filter((c) => c.length > 0)
        )

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
