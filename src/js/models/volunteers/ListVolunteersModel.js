'use strict'

var ajax = require('../../ajax')
var browser = require('../../browser')
var cookies = require('../../cookies')
var BaseViewModel = require('../BaseViewModel')
var ko = require('knockout')
var Volunteer = require('./Volunteer')

var ListVolunteersModel = function () {
  var self = this

  self.allVolunteers = ko.observableArray()
  self.volunteers = ko.observableArray()
  self.searchTerm = ko.observable()
  self.isFilteredByHighlighted = ko.observable(false)
  self.cityFilter = ko.observable()
  self.availableCities = ko.observableArray()

  self.search = () => {
    if (self.searchTerm() === undefined || self.searchTerm().length < 3) {
      self.volunteers(self.allVolunteers())
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
            v.skillsAndExperience.description,
            v.availability.description,
            v.resources.description
          ]

          let match = (field, searchTerm) => {
            return field.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0
          }

          for (let t of terms) {
            if (searchedFields.filter((f) => match(f, t)).length > 0) return true
          }
          return false
        })
      self.volunteers(filtered)
    }
  }

  self.searchTerm.subscribe(() => self.search())

  self.filterByHighlighted = () => {
    if (self.isFilteredByHighlighted()) {
      const filtered = self.volunteers()
        .filter((v) => v.isHighlighted() === true)
      self.volunteers(filtered)
    } else {
      self.search()
    }
  }

  self.isFilteredByHighlighted.subscribe(() => self.filterByHighlighted(), self)

  self.init = () => {
    browser.loading()

    const endpoint = self.endpointBuilder.volunteers().build()
    const headers = self.headers(cookies.get('session-token'))

    ajax
      .get(endpoint, headers)
      .then(function (success) {
        const volunteers = success.data
          .sort((a, b) => {
            if (a.creationDate < b.creationDate) return 1
            if (a.creationDate > b.creationDate) return -1
            return 0
          })
          .map((v) => new Volunteer(v, self))

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

  self.filterByCity = () => {
    let filtered = self.allVolunteers()
    if (self.cityFilter() !== undefined) {
      filtered = self.allVolunteers()
        .filter((sp) => sp.person.city === self.cityFilter())
    }
    self.volunteers(filtered)
  }

  self.archived = (id) => {
    self.allVolunteers(self.allVolunteers()
      .filter(v => v.id !== id))
    self.volunteers(self.volunteers()
      .filter(v => v.id !== id))
  }

  self.init()
}

ListVolunteersModel.prototype = new BaseViewModel()

module.exports = ListVolunteersModel
