let ko = require('knockout')
let ajax = require('../../ajax')
let auth = require('../../auth')
let browser = require('../../browser')
let BaseViewModel = require('../BaseViewModel')
let Update = require('./Update')

function ListImpactUpdates () {
  let self = this
  self.cities = ko.observableArray()
  self.impactUpdates = ko.observableArray()
  self.newUpdate = ko.observable(new Update(self, auth.cityAdminFor()))
  self.showCityDropDown = ko.observable(auth.isSuperAdmin())

  self.updateCreated = () => {
    self.message('Update created')
    browser.loading()
    retrieveUpdates()
  }

  self.updateAmended = () => {
    self.message('Update amended')
    browser.loading()
    retrieveUpdates()
  }

  self.updateDeleted = () => {
    browser.loading()
    retrieveUpdates()
  }

  const populateCities = () => {
    browser.loading()
    ajax
      .get(self.endpointBuilder.cities().build())
      .then((result) => {
        self.cities(result.data)
        retrieveUpdates()
      }, () => {
        self.handleServerError()
      })
  }

  const retrieveUpdates = () => {
    ajax
      .get(self.endpointBuilder.impactUpdates().build())
      .then((result) => {
        browser.loaded()
        const updates = result.data.items
          .map((u) => new Update(self, auth.cityAdminFor(), u))
        self.impactUpdates(updates)
      }, () => {
        self.handleServerError()
      })
  }

  self.init = () => {
    populateCities()
  }

  self.init()
}

ListImpactUpdates.prototype = new BaseViewModel()

module.exports = ListImpactUpdates
