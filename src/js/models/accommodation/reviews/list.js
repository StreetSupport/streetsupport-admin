let ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!

let ajax = require('../../../ajax')
let browser = require('../../../browser')
let querystring = require('../../../get-url-parameter')
let BaseViewModel = require('../../BaseViewModel')
let Item = require('./Item')

function List () {
  let self = this

  self.itemDeleted = (item) => {
    self.message('Item removed')
    const newItems = self.items()
      .filter((i) => i.formFields().idReadOnly() !== item.formFields().idReadOnly())
    self.items(newItems)
  }

  self.buildFormFields = (data) => {
    const formattedCreationDate = data.documentCreationDate !== undefined
      ? data.documentCreationDate.split('T')[0]
      : ''

    const model = ko.validatedObservable({
      idReadOnly: ko.observable(data.id),
      temporaryAccommodationIdReadOnly: ko.observable(data.temporaryAccommodationId),
      documentCreationDateReadOnly: ko.observable(formattedCreationDate),
      detailsUrl: ko.observable(`details/?accom-id=${data.temporaryAccommodationId}&id=${data.id}`)
    })
    return model
  }
  self.buildEndpoints = () => {
    return {
      save: (item) => `${item.endpointBuilder.temporaryAccommodation(item.formFields().temporaryAccommodationIdReadOnly()).build()}/reviews`,
      delete: (item) => `${item.endpointBuilder.temporaryAccommodation(item.formFields().temporaryAccommodationIdReadOnly()).build()}/reviews/${item.formFields().idReadOnly()}`
    }
  }

  self.address = ko.observable()
  self.items = ko.observableArray()
  self.hasReviews = ko.computed(() => {
    return self.items().length > 0
  }, self)

  const retrieveItems = () => {
    browser.loading()
    const id = querystring.parameter('id')
    const endpoint = `${self.endpointBuilder.temporaryAccommodation(id).build()}?expand=reviews`
    ajax
      .get(endpoint)
      .then((result) => {
        browser.loaded()

        const items = result.data.embedded.reviews
          .map((r) => new Item(self, self.buildFormFields(r), self.buildEndpoints()))
        self.items(items)
        const address = [result.data.address.street1, result.data.address.street2, result.data.address.street3, result.data.address.city, result.data.address.postcode]
          .filter((l) => l != null)
          .join(', ')
        self.address(address)
      }, () => {
        self.handleServerError()
      })
  }

  self.init = () => {
    retrieveItems()
  }

  self.init()
}

List.prototype = new BaseViewModel()

module.exports = List
