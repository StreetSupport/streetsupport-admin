'use strict'

let adminUrls = require('../../admin-urls')
let ajax = require('../../ajax')
let browser = require('../../browser')
let BaseViewModel = require('../BaseViewModel')

let ko = require('knockout')

function ActionGroup (data) {
  let self = this

  self.id = data.id
  self.name = data.name
  self.synopsis = data.synopsis
  self.url = adminUrls.actionGroups + '?id=' + data.id
}

function ListActionGroupsModel () {
  let self = this

  self.actionGroups = ko.observableArray()

  self.init = () => {
    browser.loading()
    ajax
      .get(self.endpointBuilder.actionGroups().build())
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
