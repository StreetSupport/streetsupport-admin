'use strict'

const ajax = require('../../ajax')
const browser = require('../../browser')
const BaseViewModel = require('../BaseViewModel')
const ko = require('knockout')

function User (data, listener) {
  const self = this
  self.listener = listener
  self.id = ko.observable(data.id)
  self.username = ko.observable(data.userName)
  self.email = ko.observable(data.email)
  self.claims = ko.observable(data.claims.join(', '))
  self.verificationExpiryDate = ko.observable(data.verificationExpiryDate)
  self.associatedAreaId = ko.observable(data.associatedAreaId)

  self.removeAccess = () => {
    browser.loading()

    ajax
      .delete(self.endpointBuilder.users(self.id()).build())
      .then((success) => {
        listener.userDeleted(self.id())
        browser.loaded()
      }, function (error) {
        self.handleServerError(error)
      })
  }
}

User.prototype = new BaseViewModel()

function ListUsers () {
  const self = this
  const endpoint = self.endpointBuilder.users().build()
  self.users = ko.observableArray()
  self.selectedMemberTypeFilter = ko.observable()

  self.userDeleted = function (userId) {
    self.users(self.users().filter((u) => u.id() !== userId))
  }

  self.init = () => {
    browser.loading()

    ajax
      .get(endpoint)
      .then(function (result) {
        const users = result.data
          .map((m) => new User(m, self))
          .sort((a, b) => {
            if (a.username() < b.username()) return 1
            if (b.username() > a.username()) return -1
            return 0
          })
        self.users(users)
        browser.loaded()
      }, function (error) {
        self.handleServerError(error)
      })
  }

  self.init()
}

ListUsers.prototype = new BaseViewModel()

module.exports = ListUsers
