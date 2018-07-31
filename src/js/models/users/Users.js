'use strict'

const adminUrls = require('../../admin-urls')
const ajax = require('../../ajax')
const browser = require('../../browser')
const BaseViewModel = require('../BaseViewModel')
const ko = require('knockout')
const moment = require('moment')

function User (data) {
  const self = this
  self.id = ko.observable(data.id)
  self.username = ko.observable(data.userName)
  self.email = ko.observable(data.email)
  self.claims = ko.observable(data.claims)
  self.verificationExpiryDate = ko.observable(data.verificationExpiryDate)
  self.associatedAreaId = ko.observable(data.associatedAreaId)
  self.showResendButton = ko.computed(() => {
    var now = moment()
    var expiryDate = moment(self.verificationExpiryDate())
    var diff = now.diff(expiryDate)
    return diff > 0
  }, self)

  self.resendInvite = () => {
    browser.loading()

    const endpoint = self.endpointBuilder.unverifiedUsers(self.id()).build()
    let data = {}

    ajax
      .put(endpoint, data)
      .then((result) => {
        self.verificationExpiryDate(moment().add(30, 'days').format())
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
  self.allUsers = ko.observableArray()
  self.verifiedUsers = ko.observableArray()
  self.unverifiedUsers = ko.observableArray()
  self.selectedMemberTypeFilter = ko.observable()

  self.init = () => {
    browser.loading()

    ajax
      .get(endpoint)
      .then(function (result) {
        const users = result.data
          .map((m) => new User(m))
          .sort((a, b) => {
            if (a.username() < b.username()) return 1
            if (b.username() > a.username()) return -1
            return 0
          })
        self.allUsers(users)
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
