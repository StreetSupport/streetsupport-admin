const ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!

const ajax = require('../ajax')
const BaseViewModel = require('../models/BaseViewModel')
const browser = require('../browser')
const cookies = require('../cookies')
const validation = require('../validation')

function InlineEditableSubEntity (formFields, endpoint, boolDiscFields = []) {
  const self = this

  self.booleanOrDiscretionaryDescriptions = [
    'No',
    'Yes',
    'Ask Landlord'
  ]

  self.originalData = {}
  self.isEditable = ko.observable(false)
  self.patchEndpoint = endpoint

  self.formFields = formFields
  self.boolDiscFields = boolDiscFields
  boolDiscFields
    .forEach((f) => {
      self.formFields()[`${f}ReadOnly`] = ko.computed(() => {
        return self.booleanOrDiscretionaryDescriptions[self.formFields()[f]()]
      }, self)
    })

  validation.initialise(ko.validation)
  self.fieldErrors = validation.getValidationGroup(ko.validation, self.formFields)

  self.edit = () => {
    self.isEditable(true)
  }

  self.resetData = () => {
    Object.keys(self.originalData)
      .forEach((k) => {
        try {
          self.formFields()[k](self.originalData[k])
        } catch (e) {}
      })
  }

  self.populateFormFields = (data) => {
    Object.keys(self.formFields())
      .forEach((k) => {
        try {
          if (boolDiscFields.includes(k)) {
            self.formFields()[k](`${data[k]}`)
          } else {
            self.formFields()[k](data[k])
          }
        } catch (e) {}
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
