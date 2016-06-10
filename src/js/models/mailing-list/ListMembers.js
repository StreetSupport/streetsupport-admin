'use strict'

const ajax = require('../../ajax')
const browser = require('../../browser')
const cookies = require('../../cookies')
const BaseViewModel = require('../BaseViewModel')
const ko = require('knockout')

function Member (data) {
  this.id = ko.observable(data.id)
  this.name = ko.observable(data.firstName + ' ' + data.lastName)
  this.email = ko.observable(data.email)
  this.type = ko.observable(data.memberType)
}

function ListMembers () {
  const self = this
  const endpoint = self.endpointBuilder.mailingListMembers().build()
  const headers = self.headers(cookies.get('session-token'))

  const getUniqueMemberTypes = (members) => {
    const memberTypes = []
    members
      .map((m) => m.memberType)
      .forEach((mt) => {
        if (memberTypes.indexOf(mt) < 0) memberTypes.push(mt)
      })
    return memberTypes
  }

  self.allMembers = ko.observableArray()
  self.members = ko.observableArray()
  self.memberTypes = ko.observableArray()
  self.selectedMemberTypeFilter = ko.observable()

  self.filterByType = () => {
    if (self.selectedMemberTypeFilter() === undefined) {
      self.members(self.allMembers())
    } else {
      const filtered = self.allMembers()
        .filter((m) => m.type() === self.selectedMemberTypeFilter())
      self.members(filtered)
    }
  }

  self.init = () => {
    browser.loading()

    ajax
      .get(endpoint, headers)
      .then(function (result) {
        self.allMembers(result.data.map((m) => new Member(m)))
        self.members(self.allMembers())
        self.memberTypes(getUniqueMemberTypes(result.data))
        browser.loaded()
      }, function (error) {
        self.handleServerError(error)
      })
  }

  self.init()
}

ListMembers.prototype = new BaseViewModel()

module.exports = ListMembers
