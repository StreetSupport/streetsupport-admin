'use strict'

var cookies = require('../cookies')
var browser = require('../browser')
var adminUrls = require('../admin-urls')
var ajax = require('../ajax')
var BaseViewModel = require('./BaseViewModel')

function Index () {
  var self = this
  self.init = function () {
    var sessionToken = cookies.get('session-token')

    var adminForPrefix = 'AdminFor:'

    var success = (result) => {
      var authClaims = result.data.authClaims
      let adminForClaim = authClaims.filter((a) => a.indexOf(adminForPrefix) === 0)
      if (adminForClaim.length > 0) {
        let providerKey = adminForClaim[0].substring(adminForPrefix.length)
        var destination = adminUrls.serviceProviders + '?key=' + providerKey
        browser.redirect(destination)
      } else if (authClaims.indexOf('SuperAdmin') > -1) {
        browser.redirect(adminUrls.dashboard)
      } else if (authClaims.indexOf('CharterAdmin') > -1) {
        browser.redirect(adminUrls.charter)
      }
    }

    var error = () => {
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
