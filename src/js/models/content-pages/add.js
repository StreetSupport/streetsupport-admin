const ko = require('knockout')

const ajax = require('../../ajax')
const browser = require('../../browser')
const endpoints = require('../../api-endpoints')
const htmlEncode = require('htmlencode')

const BaseViewModel = require('../BaseViewModel')
const FormData = require('form-data')

const Model = function () {
  const self = this

  self.itemCreated = ko.observable(false)
  self.title = ko.observable()
  self.body = ko.observable()
  self.tags = ko.observable([])
  self.sortPosition = ko.observable()
  self.parentScenarios = ko.observableArray([])
  self.parentScenarioId = ko.observable()
  self.type = ko.observable()
  self.availableTypes = ko.observableArray(['advice', 'guides'])
  self.formData = new FormData()

  self.save = function () {
    browser.loading()
    const payload = {
      title: self.title(),
      type: self.type(),
      body: self.body(),
      tags: self.tags().length
        ? self.tags().split(',').map((t) => t.trim())
        : [],
      sortPosition: self.sortPosition(),
      parentScenarioId: self.parentScenarioId(),
      files: []
    }

    const jsonPayload = JSON.stringify(payload)
    self.formData.append('jsonPayload', new Blob([jsonPayload], { type: 'application/json' }))

    ajax
      .postFile(endpoints.contentPages, self.formData)
      .then((result) => {
        if (result.statusCode === 201) {
          self.clearErrors()
          self.itemCreated(true)
        } else {
          self.handleError(result)
        }
        browser.loaded()
      }, (err) => {
        self.handleError(err)
      })
  }

  self.init = function () {
    self.getParentScenarios()
  }

  self.getParentScenarios = () => {
    ajax
      .get(`${endpoints.parentScenarios}`)
      .then((result) => {
        self.parentScenarios(result.data
          .map(p => {
            return {
              id: p.id,
              name: htmlEncode.htmlDecode(p.name)
            }
          })
        )
      }, () => {
        self.handleServerError()
      })
  }

  self.handleImageUpload = (event) => {
    self.formData = new FormData()
    const files = event.target.files

    for (var i = 0; i < files.length; i++) {
      self.formData.append('file' + i, files[i], files[i].name)
    }
  }

  window.document.querySelector('#fileUpload').addEventListener('change', event => {
    self.handleImageUpload(event)
  })
}

Model.prototype = new BaseViewModel()

module.exports = Model
