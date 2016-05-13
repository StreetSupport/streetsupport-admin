'use strict'

var cookies = require('../cookies')
var browser = require('../browser')
var adminUrls = require('../admin-urls')
var ajax = require('basic-ajax')
var BaseViewModel = require('./BaseViewModel')

function Index () {
  var self = this
  self.init = function () {
    var sessionToken = cookies.get('session-token')

    var adminForPrefix = 'AdminFor:'

    var success = function (success) {
      var authClaims = success.json.authClaims
      if (authClaims.indexOf('SuperAdmin') > -1) {
        browser.redirect(adminUrls.dashboard)
      } else if (authClaims.indexOf('CharterAdmin') > -1) {
        browser.redirect(adminUrls.charter)
      } else {
        let adminForClaim = authClaims.filter((a) => a.startsWith(adminForPrefix))
        if (adminForClaim.length > 0) {
          let providerKey = adminForClaim[0].substring(adminForPrefix.length)
          var destination = adminUrls.serviceProviders + '?key=' + providerKey
          browser.redirect(destination)
        }
      }
    }

    var error = function () {
      browser.redirect(adminUrls.login)
    }

    if (sessionToken === null || sessionToken === undefined) {
      browser.redirect(adminUrls.login)
    } else {
      ajax.get(self.endpointBuilder.sessions().build(), self.headers(sessionToken), {})
        .then(success, error)
    }
  }

  self.init()
}

Index.prototype = new BaseViewModel()

module.exports = Index
