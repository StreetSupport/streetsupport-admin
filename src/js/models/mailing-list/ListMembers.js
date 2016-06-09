'use strict'

const ajax = require('../../ajax')
const browser = require('../../browser')
const cookies = require('../../cookies')
const validation = require('../../validation')
const BaseViewModel = require('../BaseViewModel')
const ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!
const moment = require('moment')
const htmlEncode = require('htmlencode')

function ListMembers () {
  const self = this
  const endpoint = self.endpointBuilder.mailingListMembers().build()
  const headers = self.headers(cookies.get('session-token'))

  browser.loading()

  ajax
    .get(endpoint, headers)
    .then(function (result) {

      browser.loaded()
    }, function (error) {
      self.handleServerError(error)
    })
}

ListMembers.prototype = new BaseViewModel()

module.exports = ListMembers
