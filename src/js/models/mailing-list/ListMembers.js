'use strict'

const ajax = require('../../ajax')
const browser = require('../../browser')
const cookies = require('../../cookies')
const BaseViewModel = require('../BaseViewModel')
const ko = require('knockout')
const moment = require('moment')

function Member (data) {
  this.id = ko.observable(data.id)
  this.name = ko.observable(data.firstName + ' ' + data.lastName)
  this.email = ko.observable(data.email)
  this.type = ko.observable(data.memberType)
  this.creationDateTime = ko.observable(data.creationDateTime)
  this.joinDate = ko.observable(moment(data.creationDateTime).format('DD/MM/YY'))
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
        const members = result.data
          .map((m) => new Member(m))
          .sort((a, b) => {
            if (a.creationDateTime() < b.creationDateTime()) return 1
            if (b.creationDateTime() > a.creationDateTime()) return -1
            return 0
          })
        self.allMembers(members)
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
