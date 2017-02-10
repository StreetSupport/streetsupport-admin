const ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!

const ajax = require('../ajax')
const BaseViewModel = require('../models/BaseViewModel')
const browser = require('../browser')
const cookies = require('../cookies')
const validation = require('../validation')

function InlineEditableSubEntity (formFields, endpoint) {
  const self = this

  self.originalData = {}
  self.isEditable = ko.observable(false)
  self.patchEndpoint = endpoint

  self.formFields = formFields

  self.edit = () => {
    self.isEditable(true)
  }

  self.resetData = () => {
    Object.keys(self.originalData)
      .forEach((k) => {
        self.formFields()[k](self.originalData[k])
      })
  }

  self.populateFormFields = (data) => {
    Object.keys(self.formFields())
      .forEach((k) => {
        self.formFields()[k](data[k])
      })
    self.updateRestoreState()
  }

  self.updateRestoreState = () => {
    Object.keys(self.formFields())
      .forEach((k) => {
        self.originalData[k] = self.formFields()[k]()
      })
  }

  self.cancel = () => {
    self.resetData()
    self.isEditable(false)
  }

  self.save = () => {
    browser.loading()
    const headers = self.headers(cookies.get('session-token'))
    const payload = validation.buildPayload(self.formFields())
    ajax
      .patch(self.patchEndpoint, headers, payload)
      .then((result) => {
        self.isEditable(false)
        self.updateRestoreState()
        browser.loaded()
      })
  }
}

InlineEditableSubEntity.prototype = new BaseViewModel()

module.exports = InlineEditableSubEntity
