let ko = require('knockout')
let ajax = require('../../ajax')
let browser = require('../../browser')
let BaseViewModel = require('../BaseViewModel')
var htmlencode = require('htmlencode')
let Update = require('./Update')

function ListImpactUpdates () {
  let self = this
  self.cities = ko.observableArray()
  self.impactUpdates = ko.observableArray()
  self.newUpdate = ko.observable(new Update(self))

  self.updateCreated = () => {
    self.message('Update created')
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
        browser.loaded()
        self.cities(result.data)
      }, () => {
        self.handleServerError()
      })
  }

  const retrieveUpdates = () => {
    ajax
      .get(self.endpointBuilder.impactUpdates().build())
      .then((result) => {
        browser.loaded()
        const updates = result.data.embedded.items
          .map((u) => new Update(self, u))
          console.log(updates)
        self.impactUpdates(updates)
      }, () => {
        self.handleServerError()
      })
  }

  self.init = () => {
    populateCities()
    retrieveUpdates()
  }

  self.init()
}

ListImpactUpdates.prototype = new BaseViewModel()

module.exports = ListImpactUpdates
