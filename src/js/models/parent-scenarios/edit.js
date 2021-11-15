const ko = require('knockout')
const htmlencode = require('htmlencode')

const ajax = require('../../ajax')
const auth = require('../../auth')
const browser = require('../../browser')
const querystring = require('../../get-url-parameter')
const endpoints = require('../../api-endpoints')

const BaseViewModel = require('../BaseViewModel')

const Model = function () {
  const self = this

  self.itemCreated = ko.observable(false)
  self.name = ko.observable()
  self.body = ko.observable()
  self.tags = ko.observable('')
  self.sortPosition = ko.observable()

  self.save = function () {
    browser.loading()
    const payload = {
      name: self.name(),
      body: self.body(),
      tags: self.tags().length
        ? self.tags().split(',').map((t) => t.trim())
        : []
    }
    ajax
      .put(self.endpointBuilder.parentScenarios(querystring.parameter('id')).build(), payload)
      .then((result) => {
        if (result.statusCode === 200) {
          self.clearErrors()
          browser.redirect('/parent-scenarios')
        } else {
          self.handleError(result)
        }
        browser.loaded()
      }, (err) => {
        self.handleError(err)
      })
  }

  self.init = function () {
    browser.loading()

    // We generate this for retrieving the not cached item
    let syntaxSugar = new Date().getTime()

    ajax
      .get(self.endpointBuilder.parentScenarios(querystring.parameter('id')).build() + `?unique=${syntaxSugar}`)
      .then((result) => {
        self.name(htmlencode.htmlDecode(result.data.name))
        self.body(htmlencode.htmlDecode(result.data.body))
        self.tags(result.data.tags.join(', '))
        self.sortPosition(result.data.sortPosition)

        browser.loaded()
      }, (err) => {
        self.handleError(err)
      })
  }
}

Model.prototype = new BaseViewModel()

module.exports = Model