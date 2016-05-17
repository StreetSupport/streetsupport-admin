'use strict'

let adminUrls = require('../../admin-urls')
let ajax = require('../../ajax')
let browser = require('../../browser')
let cookies = require('../../cookies')
let BaseViewModel = require('../BaseViewModel')

let ko = require('knockout')

function Member (data) {
  let self = this

  self.firstName = data.firstName
  self.lastName = data.lastName
  self.message = data.message
  self.organisation = data.organisation
  self.email = data.email
}

function ActionGroup (data, listener) {
  let self = this

  self.listener = listener

  self.id = data.actionGroup.id
  self.name = data.actionGroup.name
  self.synopsis = data.actionGroup.synopsis
  self.description = data.actionGroup.description
  self.url = '?id=' + data.actionGroup.id

  self.members = data.members.map((m) => new Member(m))

  self.openGroup = (group, target) => {
    self.listener.actionGroupOpened(self)
  }
}

function ListActionGroupsModel () {
  let self = this

  self.actionGroups = ko.observableArray()
  self.shouldShowList = ko.observable()
  self.openedActionGroup = ko.observable()

  self.closeActionGroup = () => {
    self.shouldShowList(true)
    self.openedActionGroup(null)
  }

  self.actionGroupOpened = (actionGroup) => {
    self.shouldShowList(false)
    self.openedActionGroup(actionGroup)
    browser.pushHistory({}, actionGroup.name, actionGroup.url)
  }

  self.init = () => {
    browser.loading()
    ajax
      .get(self.endpointBuilder.actionGroups().build(),
      self.headers(cookies.get('session-token')))
      .then((result) => {
        self.actionGroups(result.data.map((ag) => new ActionGroup(ag, self)))
        browser.loaded()
        browser.setOnHistoryPop(self.closeActionGroup)
      }, () => {

      })
  }

  self.init()
}

ListActionGroupsModel.prototype = new BaseViewModel()

module.exports = ListActionGroupsModel
