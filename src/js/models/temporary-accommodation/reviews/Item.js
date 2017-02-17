let ajax = require('../../../ajax')
let BaseViewModel = require('../../BaseViewModel')
let browser = require('../../../browser')
let cookies = require('../../../cookies')
let validation = require('../../../validation')

function Item (listener, formFields, endpoints) {
  var self = this

  self.listener = listener
  self.formFields = formFields
  self.endpoints = endpoints

  self.clear = () => {
    Object.keys(self.formFields())
      .filter((k) => !k.endsWith('ReadOnly'))
      .forEach((k) => {
        self.formFields()[k](null)
      })
  }

  self.deleteUpdate = () => {
    const endpoint = self.endpointBuilder.impactUpdates(self.id()).build()
    const headers = self.headers(cookies.get('session-token'))
    browser.loading()
    ajax
      .delete(endpoint, headers)
      .then((result) => {
        browser.loaded()
        if (result.statusCode === 200) {
          listener.itemDeleted()
        } else {
          self.handleError(result.data)
        }
      }, () => {
        self.handleServerError()
      })
  }

  self.enableEditing = () => {
    self.isEditing(true)
  }

  self.cancelEditing = () => {
    self.isEditing(false)
  }

  self.update = () => {
    const endpoint = self.endpointBuilder.impactUpdates(self.id()).build()
    const headers = self.headers(cookies.get('session-token'))
    const data = {
      DisplayDate: new Date(self.displayDateYear(), self.displayDateMonth() - 1, self.displayDateDay()),
      Content: self.updateContent(),
      CityId: self.cityId()
    }
    browser.loading()
    ajax
      .put()
      .then((result) => {
        browser.loaded()
        if (result.statusCode === 200) {
          self.isEditing(false)
          listener.itemAmended()
          self.clear()
        } else {
          self.handleError(result)
        }
      }, () => {
        self.handleServerError()
      })
  }

  self.save = () => {
    const headers = self.headers(cookies.get('session-token'))
    browser.loading()
    ajax
      .post(self.endpoints.save(self), headers, validation.buildPayload(self.formFields()))
      .then((result) => {
        browser.loaded()
        if (result.statusCode === 201) {
          self.formFields().idReadOnly(result.data.id)
          listener.itemCreated(self)
          self.clear()
        } else {
          self.handleError(result)
        }
      }, () => {
        self.handleServerError()
      })
  }
}

Item.prototype = new BaseViewModel()

module.exports = Item
