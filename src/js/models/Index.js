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
      if (authClaims[0] === 'SuperAdmin') {
        browser.redirect(adminUrls.dashboard)
      } else if (authClaims[0].startsWith(adminForPrefix)) {
        var destination = adminUrls.serviceProviders + '?key=' + authClaims[0].substring(adminForPrefix.length)
        browser.redirect(destination)
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
