'use strict'

var ajax = require('../../ajax')
var adminUrls = require('../../admin-urls')
var browser = require('../../browser')
var cookies = require('../../cookies')
var BaseViewModel = require('../BaseViewModel')
var ko = require('knockout')
var moment = require('moment')

let Volunteer = function (data) {
  let self = this
  self.id = data.id
  self.person = {
    firstName: data.person.firstName,
    lastName: data.person.lastName,
    email: data.person.email,
    telephone: data.person.telephone,
    postcode: data.person.postcode
  }
  self.description = data.description
  self.additionalInfo = data.additionalInfo

  self.contactUrl = adminUrls.contactVolunteer + '?id=' + data.id
  self.creationDate = moment(data.creationDate).format('DD/MM/YY')
  self.isHighlighted = ko.observable(false)
  self.highlighted = ko.computed(() => {
    return self.isHighlighted()
      ? 'volunteer volunteer--highlighted'
      : 'volunteer'
  }, self)
}

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

  self.init = () => {
    browser.loading()

    const endpoint = self.endpointBuilder.offersOfItems().build()
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
          .map((v) => new Volunteer(v))

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
