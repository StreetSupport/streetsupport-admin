'use strict'

var ajax = require('../../ajax')
var browser = require('../../browser')
var BaseViewModel = require('../BaseViewModel')
var ItemOfferer = require('./ItemOfferer')
var ko = require('knockout')

var ListModel = function () {
  var self = this

  self.allVolunteers = ko.observableArray()
  self.offers = ko.observableArray()
  self.searchTerm = ko.observable()
  self.isFilteredByHighlighted = ko.observable(false)

  self.search = () => {
    if (self.searchTerm() === undefined || self.searchTerm().length < 3) {
      self.offers(self.allVolunteers())
    } else {
      let terms = self.searchTerm()
        .split(',')
        .map((t) => t.trim())

      let filtered = self.allVolunteers()
        .filter((v) => {
          let searchedFields = [
            v.person.firstName,
            v.person.lastName,
            v.person.email,
            v.person.telephone,
            v.person.postcode,
            v.description,
            v.additionalInfo
          ]

          let match = (field, searchTerm) => {
            return field.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0
          }

          for (let t of terms) {
            if (searchedFields.filter((f) => match(f, t)).length > 0) return true
          }
          return false
        })
      self.offers(filtered)
    }
  }

  self.searchTerm.subscribe(() => self.search())

  self.filterByHighlighted = () => {
    if (self.isFilteredByHighlighted()) {
      const filtered = self.offers()
        .filter((v) => v.isHighlighted() === true)
      self.offers(filtered)
    } else {
      self.search()
    }
  }

  self.isFilteredByHighlighted.subscribe(() => self.filterByHighlighted(), self)

  self.archived = (id) => {
    self.offers(self.offers()
      .filter((v) => v.id !== id))
  }

  self.init = () => {
    browser.loading()

    const endpoint = self.endpointBuilder.offersOfItems().build()
    ajax
      .get(endpoint)
      .then(function (success) {
        const volunteers = success.data
          .sort((a, b) => {
            if (a.creationDate < b.creationDate) return 1
            if (a.creationDate > b.creationDate) return -1
            return 0
          })
          .map((v) => new ItemOfferer(v, self))

        self.allVolunteers(volunteers)
        self.offers(volunteers)
        browser.loaded()
      }, function (error) {
        self.handleServerError(error)
      })
  }

  self.init()
}

ListModel.prototype = new BaseViewModel()

module.exports = ListModel
