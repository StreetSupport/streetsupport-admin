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

  validation.initialise(ko.validation)
  self.fieldErrors = validation.getValidationGroup(ko.validation, self.formFields)

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
        console.log(k, data[k])
        self.formFields()[k](data[k])
        console.log(self.formFields()[k]())
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

  self.patchData = () => {
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

  self.save = () => {
    if (self.formFields.isValid()) {
      self.patchData()
    } else {
      validation.showErrors(self.fieldErrors)
    }
  }
}

InlineEditableSubEntity.prototype = new BaseViewModel()

module.exports = InlineEditableSubEntity
