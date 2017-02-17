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
      idReadOnly: ko.observable(data.id),
      temporaryAccommodationIdReadOnly: ko.observable(data.temporaryAccommodationId),
      hasCentralHeating: ko.observable(data.hasCentralHeating),
      hasHotWater: ko.observable(data.hasHotWater),
      hasElectricity: ko.observable(data.hasElectricity),
      hasLockOnRoom: ko.observable(data.hasLockOnRoom),
      hasLockOnFrontDoor: ko.observable(data.hasLockOnFrontDoor),
      hasAggressiveTenants: ko.observable(data.hasAggressiveTenants),
      hasExcessiveNoise: ko.observable(data.hasExcessiveNoise),
      foodRating: ko.observable(data.foodRating),
      cleanlinessRating: ko.observable(data.cleanlinessRating),
      staffHelpfulnessRating: ko.observable(data.staffHelpfulnessRating),
      staffSupportivenessRating: ko.observable(data.staffSupportivenessRating),
      staffDealingWithProblemsRating: ko.observable(data.staffDealingWithProblemsRating),
      staffTimelinessWithIssuesRating: ko.observable(data.staffTimelinessWithIssuesRating)
    })
  }
  self.buildEndpoints = () => {
    return {
      save: (item) => `${item.endpointBuilder.temporaryAccommodation(item.formFields().temporaryAccommodationIdReadOnly()).build()}/reviews`,
      delete: (item) => `${item.endpointBuilder.temporaryAccommodation(item.formFields().temporaryAccommodationIdReadOnly()).build()}/reviews/${item.formFields().idReadOnly()}`
    }
  }

  self.newItem = ko.observable(new Item(self, self.buildFormFields(), self.buildEndpoints()))
  self.items = ko.observableArray()

  self.itemCreated = (item) => {
    self.message('Item created')
    const formFields = {}
    Object.keys(item.formFields())
      .filter((k) => !k.endsWith('ReadOnly'))
      .forEach((k) => {
        formFields[k] = item.formFields()[k]()
      })
    Object.keys(item.formFields())
      .filter((k) => k.endsWith('ReadOnly'))
      .forEach((k) => {
        formFields[k.replace('ReadOnly', '')] = item.formFields()[k]()
      })
    self.items().unshift(new Item(self, self.buildFormFields(formFields), self.buildEndpoints()))
  }

  self.itemAmended = () => {
    self.message('Item amended')
  }

  self.itemDeleted = (item) => {
    self.message('Item removed')
    const newItems = self.items()
      .filter((i) => i.formFields().idReadOnly() !== item.formFields().idReadOnly())
    self.items(newItems)
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
