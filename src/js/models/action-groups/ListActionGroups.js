'use strict'

let adminUrls = require('../../admin-urls')
let ajax = require('../../ajax')
let browser = require('../../browser')
let cookies = require('../../cookies')
let BaseViewModel = require('../BaseViewModel')

let ko = require('knockout')

function ActionGroup (data) {
  let self = this

  self.id = data.actionGroup.id
  self.name = data.actionGroup.name
  self.synopsis = data.actionGroup.synopsis
  self.description = data.actionGroup.description
  self.url = adminUrls.actionGroups + '?id=' + data.actionGroup.id
}

function ListActionGroupsModel () {
  let self = this

  self.actionGroups = ko.observableArray()

  self.init = () => {
    browser.loading()
    ajax
      .get(self.endpointBuilder.actionGroups().build(),
      self.headers(cookies.get('session-token')))
      .then((result) => {
        self.actionGroups(result.data.map((ag) => new ActionGroup(ag)))
        browser.loaded()
      }, () => {

      })
  }

  self.init()
}

ListActionGroupsModel.prototype = new BaseViewModel()

module.exports = ListActionGroupsModel
