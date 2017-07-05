const ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!

const ajax = require('../ajax')
const BaseViewModel = require('../models/BaseViewModel')
const browser = require('../browser')
const cookies = require('../cookies')
const validation = require('../validation')

function InlineEditableSubEntity (configOverride = {}) {
  const config = {
    formFields: [],
    patchEndpoint: '',
    boolDiscFields: [],
    dropdownFields: [],
    computedFields: []
  }

  const self = this

  for (let k in configOverride) config[k] = configOverride[k]

  self.booleanOrDiscretionaryDescriptions = [
    'No',
    'Yes',
    'Don\'t Know/Ask'
  ]

  self.originalData = {}
  self.isEditable = ko.observable(false)
  self.patchEndpoint = config.patchEndpoint

  self.formFields = config.formFields
  config.boolDiscFields
    .forEach((f) => {
      self.formFields()[`${f}ReadOnly`] = ko.computed(() => {
        return self.booleanOrDiscretionaryDescriptions[self.formFields()[f]()]
      }, self)
    })

  config.dropdownFields
    .forEach((f) => {
      self[`${f.collection}`] = ko.observableArray()
      self.formFields()[`${f.fieldId}ReadOnly`] = ko.computed(() => {
        const match = self[`${f.collection}`]().find((i) => i.id === self.formFields()[`${f.fieldId}`]())
        return match
          ? match.name
          : ''
      }, self)
    })

  config.computedFields
    .forEach((cf) => {
      self.formFields()[cf.destField] = ko.computed(() => {
        return cf.computation(self.formFields()[cf.sourceField]())
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

  self.populateFormFields = (configOverride = {}) => {
    const popConfig = {
      data: {},
      preParseFields: []
    }

    for (let k in configOverride) popConfig[k] = configOverride[k]

    Object.keys(self.formFields())
      .forEach((k) => {
        const preParseRule = popConfig.preParseFields.find((pp) => pp.fieldId === k)
        try {
          if (config.boolDiscFields.includes(k)) {
            self.formFields()[k](`${popConfig.data[k]}`)
          } else if (preParseRule !== undefined) {
            self.formFields()[k](preParseRule.cleanFunction(popConfig.data[k]))
          } else {
            self.formFields()[k](popConfig.data[k])
          }
        } catch (e) {
          // cannot write a value to a ko.computed
        }
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
