let ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!

let ajax = require('../../../ajax')
let browser = require('../../../browser')
let cookies = require('../../../cookies')
let querystring = require('../../../get-url-parameter')
let BaseViewModel = require('../../BaseViewModel')
let Item = require('./Item')

function ListAndAdd () {
  let self = this

  self.buildFormFields = (data = {}) => {
    return ko.validatedObservable({
      idReadOnly: ko.observable(data.Id),
      temporaryAccommodationIdReadOnly: ko.observable(data.TemporaryAccommodationId),
      hasCentralHeating: ko.observable(data.HasCentralHeating),
      hasHotWater: ko.observable(data.HasHotWater),
      hasElectricity: ko.observable(data.HasElectricity),
      hasLockOnRoom: ko.observable(data.HasLockOnRoom),
      hasLockOnFrontDoor: ko.observable(data.HasLockOnFrontDoor),
      hasAggressiveTenants: ko.observable(data.HasAggressiveTenants),
      hasExcessiveNoise: ko.observable(data.HasExcessiveNoise),
      foodRating: ko.observable(data.FoodRating),
      cleanlinessRating: ko.observable(data.CleanlinessRating),
      staffHelpfulnessRating: ko.observable(data.StaffHelpfulnessRating),
      staffSupportivenessRating: ko.observable(data.StaffSupportivenessRating),
      staffDealingWithProblemsRating: ko.observable(data.StaffDealingWithProblemsRating),
      staffTimelinessWithIssuesRating: ko.observable(data.StaffTimelinessWithIssuesRating)
    })
  }
  self.buildEndpoints = () => {
    return {
      save: (item) => `${item.endpointBuilder.temporaryAccommodation(item.formFields().temporaryAccommodationIdReadOnly()).build()}/reviews`
    }
  }

  self.impactUpdates = ko.observableArray()
  self.newItem = ko.observable(new Item(self, self.buildFormFields(), self.buildEndpoints()))

  self.items = ko.observableArray()

  self.itemCreated = (item) => {
    self.message('Item created')
    const formFields = {}
    Object.keys(item.formFields())
      .filter((k) => !k.endsWith('ReadOnly'))
      .forEach((k) => {
        formFields[`${k.charAt(0).toUpperCase()}${k.substr(1)}`] = item.formFields()[k]()
      })
    Object.keys(item.formFields())
      .filter((k) => k.endsWith('ReadOnly'))
      .forEach((k) => {
        formFields[`${k.charAt(0).toUpperCase()}${k.substr(1)}`.replace('ReadOnly', '')] = item.formFields()[k]()
      })
    self.items().unshift(new Item(self, self.buildFormFields(formFields), self.buildEndpoints()))
  }

  self.itemAmended = () => {
    self.message('Item amended')
  }

  self.itemDeleted = () => {
    self.message('Item removed')
  }

  const retrieveItems = () => {
    browser.loading()
    const id = querystring.parameter('id')
    const endpoint = `${self.endpointBuilder.temporaryAccommodation(id).build()}?expand=reviews`
    const headers = self.headers(cookies.get('session-token'))
    ajax
      .get(endpoint, headers)
      .then((result) => {
        browser.loaded()

        const items = result.data.embedded.reviews
          .map((r) => new Item(self, self.buildFormFields(r), self.buildEndpoints()))
        self.items(items)
        self.newItem().formFields().temporaryAccommodationIdReadOnly(result.data.id)
      }, () => {
        self.handleServerError()
      })
  }

  self.init = () => {
    retrieveItems()
  }

  self.init()
}

ListAndAdd.prototype = new BaseViewModel()

module.exports = ListAndAdd
