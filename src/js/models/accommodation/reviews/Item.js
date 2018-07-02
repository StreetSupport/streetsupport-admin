let ajax = require('../../../ajax')
let BaseViewModel = require('../../BaseViewModel')
let browser = require('../../../browser')
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

  self.deleteItem = () => {
    const endpoint = endpoints.delete(self)
    browser.loading()
    ajax
      .delete(endpoint)
      .then((result) => {
        browser.loaded()
        if (result.statusCode === 200) {
          listener.itemDeleted(self)
        } else {
          self.handleError(result.data)
        }
      }, () => {
        self.handleServerError()
      })
  }

  self.update = () => {
    browser.loading()
    const endpoint = endpoints.update(self)
    const payload = validation.buildPayload(self.formFields())
    ajax
      .patch(endpoint, payload)
      .then((result) => {
        browser.loaded()
        if (result.statusCode.toString().charAt(0) === '2') {
          listener.itemUpdated(self)
        } else {
          self.handleError(result.data)
        }
      }, () => {
        self.handleServerError()
      })
  }

  self.save = () => {
    browser.loading()
    ajax
      .post(self.endpoints.save(self), validation.buildPayload(self.formFields()))
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
