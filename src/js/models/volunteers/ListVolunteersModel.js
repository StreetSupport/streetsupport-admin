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

  self.init = () => {
    browser.loading()

    const endpoint = self.endpointBuilder.volunteers().build()
    ajax
      .get(endpoint)
      .then(function (result) {
        const volunteers = result.data
          .sort((a, b) => {
            if (a.creationDate < b.creationDate) return 1
            if (a.creationDate > b.creationDate) return -1
            return 0
          })
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

  // self.filterByCity = () => {
  //   let filtered = self.allVolunteers()
  //   if (self.cityFilter() !== undefined) {
  //     filtered = self.allVolunteers()
  //       .filter((sp) => sp.person.city === self.cityFilter())
  //   }
  //   self.volunteers(filtered)
  // }

  self.archived = (id) => {
    self.allVolunteers(self.allVolunteers()
      .filter((v) => v.id !== id))
    self.volunteers(self.volunteers()
      .filter((v) => v.id !== id))
  }

  self.init()
}

ListVolunteersModel.prototype = new BaseViewModel()

module.exports = ListVolunteersModel
