'use strict'

const ajax = require('../../ajax')
const browser = require('../../browser')
const querystring = require('../../get-url-parameter')
const BaseViewModel = require('../BaseViewModel')

const ko = require('knockout')
const moment = require('moment')

function Member (data) {
  const self = this

  self.firstName = data.firstName
  self.lastName = data.lastName
  self.message = data.message
  self.organisation = data.organisation
  self.email = data.email
  self.creationDate = moment(data.creationDate).format('DD/MM/YY')
}

function ActionGroup (data, listener) {
  const self = this

  self.listener = listener

  self.id = data.actionGroup.id
  self.name = data.actionGroup.name
  self.synopsis = data.actionGroup.synopsis
  self.description = data.actionGroup.description
  self.url = '?id=' + data.actionGroup.id

  self.members = data.members
    .sort((a, b) => {
      if (a.creationDate < b.creationDate) return 1
      if (a.creationDate > b.creationDate) return -1
      return 0
    })
    .map((m) => new Member(m))

  self.openGroup = (group, target) => {
    self.listener.actionGroupOpened(self)
  }
}

function ListActionGroupsModel () {
  const self = this

  self.actionGroups = ko.observableArray()
  self.shouldShowList = ko.observable(true)
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

  self.backToList = () => {
    self.closeActionGroup()
    browser.popHistory()
  }

  self.init = () => {
    browser.loading()
    ajax
      .get(self.endpointBuilder.actionGroups().build())
      .then((result) => {
        self.actionGroups(result.data.map((ag) => new ActionGroup(ag, self)))

        const preselectedActionGroupId = querystring.parameter('id')
        if (preselectedActionGroupId.length > 0) {
          self.actionGroupOpened(self.actionGroups().filter((ag) => ag.id === preselectedActionGroupId)[0])
        }

        browser.loaded()
        browser.setOnHistoryPop(self.closeActionGroup)
      }, () => {

      })
  }

  self.init()
}

ListActionGroupsModel.prototype = new BaseViewModel()

module.exports = ListActionGroupsModel
