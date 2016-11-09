'use strict'

const adminUrls = require('../../admin-urls')
const ajax = require('../../ajax')
const browser = require('../../browser')
const cookies = require('../../cookies')
const BaseViewModel = require('../BaseViewModel')
const ko = require('knockout')
const moment = require('moment')

function User (data) {
  const self = this
  self.id = ko.observable(data.id)
  self.username = ko.observable(data.userName)
  self.email = ko.observable(data.email)
  self.claims = ko.observable(data.claims)
  self.verificationExpiryDate = ko.observable(moment(data.verificationExpiryDate).format('DD/MM/YY'))
  self.showResendButton = ko.computed(() => {
    var now = moment()
    var expiryDate = moment(data.verificationExpiryDate)
    var diff = now.diff(expiryDate)
    return diff > 0
  }, self)

  self.resendInvite = () => {
    browser.loading()

    const endpoint = self.endpointBuilder.unverifiedUsers(self.id()).build()
    const headers = self.headers(cookies.get('session-token'))
    let data = {}

    ajax
      .put(endpoint, headers, data)
      .then((result) => {
        browser.loaded()
      }, (_) => {
        browser.redirect(adminUrls.fiveHundred)
      })
  }
}

User.prototype = new BaseViewModel()

function ListUsers () {
  const self = this
  const endpoint = self.endpointBuilder.users().build()
  const headers = self.headers(cookies.get('session-token'))

  self.allUsers = ko.observableArray()
  self.verifiedUsers = ko.observableArray()
  self.unverifiedUsers = ko.observableArray()
  self.selectedMemberTypeFilter = ko.observable()

  self.init = () => {
    browser.loading()

    ajax
      .get(endpoint, headers)
      .then(function (result) {
        const users = result.data
          .map((m) => new User(m))
          .sort((a, b) => {
            if (a.username() < b.username()) return 1
            if (b.username() > a.username()) return -1
            return 0
          })
        self.allUsers(users)
        console.log(self.allUsers())
        self.unverifiedUsers(self.allUsers().filter((u) => u.username() === null))
        self.verifiedUsers(self.allUsers().filter((u) => u.username() !== null))
        browser.loaded()
      }, function (error) {
        self.handleServerError(error)
      })
  }

  self.init()
}

ListUsers.prototype = new BaseViewModel()

module.exports = ListUsers
