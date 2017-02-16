let ko = require('knockout')
let ajax = require('../../../ajax')
let browser = require('../../../browser')
let querystring = require('../../../get-url-parameter')
let BaseViewModel = require('../../BaseViewModel')
let Item = require('./Item')

function ListAndAdd () {
  let self = this
  self.impactUpdates = ko.observableArray()
  self.newItem = ko.observable(new Item(self))

  self.itemCreated = () => {
    self.message('Item created')
    browser.loading()
    retrieveItems()
  }

  self.itemAmended = () => {
    self.message('Item amended')
    browser.loading()
    retrieveItems()
  }

  self.itemDeleted = () => {
    browser.loading()
    retrieveItems()
  }

  const retrieveItems = () => {
    const id = querystring.parameter('id')
    ajax
      .get(self.endpointBuilder.temporaryAccommodation(id).reviews().build())
      .then((result) => {
        browser.loaded()
        const items = result.data.items
          .map((u) => new Item(self, u))
        self.item(items)
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
