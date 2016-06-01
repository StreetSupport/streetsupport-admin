'use strict'

var ajax = require('../../ajax')
var adminUrls = require('../../admin-urls')
var browser = require('../../browser')
var cookies = require('../../cookies')
var BaseViewModel = require('../BaseViewModel')
var ko = require('knockout')
var moment = require('moment')

var ListVolunteersModel = function () {
  var self = this

  self.allVolunteers = ko.observableArray()
  self.volunteers = ko.observableArray()
  self.searchTerm = ko.observable()

  self.search = () => {
    let filtered = self.allVolunteers()
    if (self.searchTerm().length > 2) {
      let terms = self.searchTerm()
        .split(',')
        .map((t) => t.trim())

      filtered = self.allVolunteers().filter((v) => {
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
    }
    self.volunteers(filtered)
  }

  self.searchTerm.subscribe(() => self.search())

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

        volunteers.forEach(v => {
          v.contactUrl = adminUrls.contactVolunteer + '?id=' + v.id
          v.creationDate = moment(v.creationDate).format('DD/MM/YY')
        })
        self.allVolunteers(volunteers)
        self.volunteers(volunteers)
        browser.loaded()
      }, function (error) {
        self.handleServerError(error)
      })
  }

  self.init()
}

ListVolunteersModel.prototype = new BaseViewModel()

module.exports = ListVolunteersModel
